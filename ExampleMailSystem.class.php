<?php
/**
 * Modify the drupal mail system to send HTML emails.
 */

function setVariableMailSystem(){
  variable_set('mail_system', 
    array(
      'default-system' => 'ExampleMailSystem',  //'DefaultMailSystem', 
      'example' => 'ExampleMailSystem'
    )
  );
}
function delVariableMailSystem(){
  variable_del('mail_system');  
}

class ExampleMailSystem implements MailSystemInterface {
  /**
   * Concatenate and wrap the e-mail body for plain-text mails.
   *
   * @param $message
   *   A message array, as described in hook_mail_alter().
   *
   * @return
   *   The formatted $message.
   */
  
  
  public function format(array $message) {
    $message['body'] = implode("\n\n", $message['body']);
    return $message;
  }
  /**
   * Send an e-mail message, using Drupal variables and default settings.
   *
   * @see http://php.net/manual/en/function.mail.php
   * @see drupal_mail()
   *
   * @param $message
   *   A message array, as described in hook_mail_alter().
   * @return
   *   TRUE if the mail was successfully accepted, otherwise FALSE.
   */
  public function mail(array $message) {
    dpm($message,'class ExampleMailSystem:message');
    if (!isset($message['headers']['From'])){
      $default_from = variable_get('site_mail', ini_get('sendmail_from'));
      if ($default_from) {
        // To prevent e-mail from looking like spam, the addresses in the Sender and
        // Return-Path headers should have a domain authorized to use the originating
        // SMTP server.
        $headers['From'] = $headers['Sender'] = $headers['Return-Path'] = $default_from;
      }
    }
    $mimeheaders = array();
    foreach ($message['headers'] as $name => $value) {
      $mimeheaders[] = $name . ': ' . mime_header_encode($value);
    }
    //dpm($mimeheaders);
    $line_endings = variable_get('mail_line_endings', MAIL_LINE_ENDINGS);
    return mail(
      $message['to'],
      mime_header_encode($message['subject']),
      // Note: e-mail uses CRLF for line-endings. PHP's API requires LF
      // on Unix and CRLF on Windows. Drupal automatically guesses the
      // line-ending format appropriate for your system. If you need to
      // override this, adjust $conf['mail_line_endings'] in settings.php.
      preg_replace('@\r?\n@', $line_endings, $message['body']),
      // For headers, PHP's API suggests that we use CRLF normally,
      // but some MTAs incorrectly replace LF with CRLF. See #234403.
      join("\n", $mimeheaders)
    );
  }
}
?>
