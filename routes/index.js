var express = require('express');
var router = express.Router();
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
// mail client
var Imap = require('imap'),
    inspect = require('util').inspect;
var fs = require('fs'), fileStream;
const { simpleParser } = require('mailparser');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

let emails = [];
// Get emails data
router.get('/order-emails', (req, res)=>{
  try {
    res.status(200).json({
      message: 'You successfully fetched data',
      data: emails
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


// mail client

var imap = new Imap({
  user: 'tonyjoss1990@gmail.com',
  password: 'tonyjoss19901102@',
  host: 'imap.gmail.com',
  port: 993,
  tls: true
});
 
function openInbox(cb) {
  imap.openBox('INBOX', true, cb);
}
 
imap.once('ready', function() {
  openInbox(function(err, box) {
    if (err) throw err;
    imap.search([ 'UNSEEN', ['HEADER', 'SUBJECT', 'order number'], ['SINCE', new Date()] ], function(err, results) {
      if (err) throw err;
      var f = imap.fetch(results, { bodies: '' });
      f.on('message', function(msg, seqno) {
        console.log('Message #%d', seqno);
        var prefix = '(#' + seqno + ') ';
        msg.on('body', function(stream, info) {
          
          simpleParser(stream, async (err, parsed) => {
            // const {from, subject, textAsHtml, text} = parsed;
            emails.push(parsed)
            /* Make API call to save the data
               Save the retrieved data into a database.
               E.t.c
            */
          });
          console.log(prefix + 'Body');
          stream.pipe(fs.createWriteStream('msg-' + seqno + '-body.txt'));
        });
        msg.once('attributes', function(attrs) {
          console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
        });
        msg.once('end', function() {
          console.log(prefix + 'Finished');
        });
      });
      f.once('error', function(err) {
        console.log('Fetch error: ' + err);
      });
      f.once('end', function() {
        console.log('Done fetching all messages!');
        imap.end();
      });
    });
  });
  
});
 
imap.once('error', function(err) {
  console.log(err);
});
 
imap.once('end', function() {
  console.log('Connection ended');
});
 
imap.connect();


 


module.exports = router;
