<?php
declare(strict_types=1);

// api/DatabaseMigrator.php

class DatabaseMigrator
{
    private PDO $pdo;
    private string $dbType;

    public function __construct(PDO $pdo, string $dbType)
    {
        $this->pdo = $pdo;
        $this->dbType = $dbType;
    }

    public function tableExists(string $table): bool
    {
        try {
            if ($this->dbType === 'sqlite') {
                $stmt = $this->pdo->prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?");
                $stmt->execute([$table]);
                return $stmt->fetch() !== false;
            }
            else {
                $stmt = $this->pdo->query("SHOW TABLES LIKE '$table'");
                return $stmt->rowCount() > 0;
            }
        }
        catch (PDOException $e) {
            return false;
        }
    }

    public function columnExists(string $table, string $column): bool
    {
        try {
            if ($this->dbType === 'sqlite') {
                $stmt = $this->pdo->query("PRAGMA table_info($table)");
                $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
                foreach ($columns as $col) {
                    if ($col['name'] === $column)
                        return true;
                }
                return false;
            }
            else {
                $stmt = $this->pdo->query("SHOW COLUMNS FROM $table LIKE '$column'");
                return $stmt->rowCount() > 0;
            }
        }
        catch (PDOException $e) {
            return false;
        }
    }

    public function migrate(array $schema): array
    {
        $logs = [];
        $autoIncrement = ($this->dbType === 'sqlite') ? 'INTEGER PRIMARY KEY AUTOINCREMENT' : 'INT AUTO_INCREMENT PRIMARY KEY';
        $jsonType = ($this->dbType === 'sqlite') ? 'TEXT' : 'JSON';

        foreach ($schema as $tableName => $tableDef) {
            // 1. Create table if not exists (using initial structure)
            if (!$this->tableExists($tableName)) {
                $columnsSql = [];
                foreach ($tableDef['columns'] as $colName => $colDef) {
                    $def = str_replace('{AUTO_INCREMENT}', $autoIncrement, $colDef);
                    $def = str_replace('{JSON}', $jsonType, $def);
                    $columnsSql[] = "$colName $def";
                }

                if (isset($tableDef['constraints'])) {
                    foreach ($tableDef['constraints'] as $constraint) {
                        $columnsSql[] = $constraint;
                    }
                }

                $sql = "CREATE TABLE IF NOT EXISTS $tableName (" . implode(",\n", $columnsSql) . ")";
                $this->pdo->exec($sql);
                $logs[] = "Table '$tableName' created.";

                // Add explicit indexes if defined right after creation
                if (isset($tableDef['indexes'])) {
                    foreach ($tableDef['indexes'] as $indexSql) {
                        try {
                            $this->pdo->exec($indexSql);
                            $logs[] = "Index created for '$tableName'.";
                        }
                        catch (PDOException $e) {
                            // Ignore index exists errors
                            $logs[] = "Notice: Index creation skipped or failed for '$tableName': " . $e->getMessage();
                        }
                    }
                }
            }
            else {
                $logs[] = "Table '$tableName' exists. Checking columns...";
                // 2. Add missing columns to existing table
                foreach ($tableDef['columns'] as $colName => $colDef) {
                    if (!$this->columnExists($tableName, $colName)) {
                        $def = str_replace('{AUTO_INCREMENT}', $autoIncrement, $colDef);
                        $def = str_replace('{JSON}', $jsonType, $def);
                        $sql = "ALTER TABLE $tableName ADD COLUMN $colName $def";
                        $this->pdo->exec($sql);
                        $logs[] = "Column '$colName' added to '$tableName'.";

                        // Handle post-migration initial data injections if specified
                        if (isset($tableDef['post_column_scripts'][$colName])) {
                            try {
                                $this->pdo->exec($tableDef['post_column_scripts'][$colName]);
                                $logs[] = "Executed post-column script for '$tableName.$colName'.";
                            }
                            catch (Exception $e) {
                                $logs[] = "Error executing post-column script: " . $e->getMessage();
                            }
                        }
                    }
                }
            }
        }
        return $logs;
    }
}