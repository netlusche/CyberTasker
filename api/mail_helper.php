<?php
// api/mail_helper.php

function sendMail($to, $subject, $body)
{
    if (!$to)
        return false;

    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
    // Remove port if present
    $host = explode(':', $host)[0];
    $fromEmail = "no-reply@" . $host;

    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: CyberTasker <$fromEmail>" . "\r\n";
    $headers .= "Reply-To: $fromEmail" . "\r\n";
    $headers .= "Return-Path: $fromEmail" . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // Wrap body in a simple HTML template
    $htmlMessage = "
    <html>
    <head>
        <title>$subject</title>
        <style>
            body { font-family: 'Courier New', monospace; background-color: #0d0d0d; color: #00ff9d; padding: 20px; }
            .container { border: 1px solid #00ff9d; padding: 20px; max-width: 600px; margin: 0 auto; }
            h1 { border-bottom: 1px solid #00ff9d; padding-bottom: 10px; }
            .footer { margin-top: 20px; font-size: 0.8em; color: #555; border-top: 1px dashed #333; padding-top: 10px; }
            a { color: #3b82f6; text-decoration: none; font-weight: bold; }
            a:hover { text-decoration: underline; color: #60a5fa; }
        </style>
    </head>
    <body>
        <div class='container'>
            <h1>CYBER TASKER // TRANSMISSION</h1>
            <p>$body</p>
            <div class='footer'>
                SECURE CHANNEL ESTABLISHED.<br>
                ORIGIN: CYBER_TASKER_CORE
            </div>
        </div>
    </body>
    </html>
    ";

    // Send mail and log result
    $success = @mail($to, $subject, $htmlMessage, $headers);

    $logFile = __DIR__ . '/mail_log.txt';
    $timestamp = date('Y-m-d H:i:s');

    if ($success) {
        $logMessage = "[$timestamp] MAIL_HELPER: Successfully sent email to $to with subject '$subject'\n";
    }
    else {
        $errorInfo = error_get_last();
        $errorMessage = $errorInfo ? $errorInfo['message'] : 'Unknown error';
        $logMessage = "[$timestamp] MAIL_HELPER: Failed to send email to $to with subject '$subject'. Error: $errorMessage\n";
    }

    // Create a plain text version for easier reading in the terminal
    $plainBody = str_replace(['<br>', '<br/>', '<br />'], "\n", $body);
    $plainBody = strip_tags($plainBody);

    // Append the body to the log for local testing visibility
    $logMessage .= "--- EMAIL BODY ---\n$htmlMessage\n------------------\n\n";

    @file_put_contents($logFile, $logMessage, FILE_APPEND);

    return $success;
}