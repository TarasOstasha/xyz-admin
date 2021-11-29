var express = require('express');
var router = express.Router();
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const Emails = require('../models/emailModel');
let emails = []; // arr all emails from email API


// mail client
var Imap = require('imap'),
  inspect = require('util').inspect;
var fs = require('fs'), fileStream;
const { simpleParser } = require('mailparser');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});



// Get emails data from email API
router.get('/order-emails', (req, res) => {
  try {
    res.status(200).json({
      message: 'You successfully fetched data',
      data: emails
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ||||||||||||||||||||||||||||||||||||||||||
//received all emails from front end
router.post('/all-emails', (req, res) => {
  console.log('post all emails')
  const dataEmails = emails;
  console.log(dataEmails)
  const newEmails = new Emails({
    allInfo: dataEmails
  })
  newEmails.save()
    .then(result => {
      res.status(201).json({
        message: 'New emails Created',
        result: result,
        ok: true
      });
    })
    .catch(err => {
      res.status(500).json({
        message: 'Error'
      });
    });
  //console.log(req.body)
});

router.get('/all-emails', (req, res) => {
  Emails.find({})
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: 'Not Found'
        });
      }
      res.status(200).json({
        message: 'You successfully fetched emails',
        result: result
      });
    })
    .catch(err => {
      res.status(500).json({
        err,
        message: 'Error'
      });
    });
});










// *** mail client

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

imap.once('ready', function () {
  openInbox(function (err, box) {
    if (err) throw err;
    imap.search(['UNSEEN', ['HEADER', 'SUBJECT', 'order number'], ['SINCE', new Date()]], function (err, results) {
      if (err) throw err;
      var f = imap.fetch(results, { bodies: '' });
      f.once('message', function (msg, seqno) {
        console.log('Message #%d', seqno);
        var prefix = '(#' + seqno + ') ';
        msg.once('body', function (stream, info) {

          simpleParser(stream, async (err, parsed) => {
            // const {from, subject, textAsHtml, text} = parsed;
            emails.push(parsed)
            const dataBaseEmails = new Emails({
              allInfo: emails
            })
            dataBaseEmails.save()
            /* Make API call to save the data
               Save the retrieved data into a database.
               E.t.c
            */
          });
          console.log(prefix + 'Body');
          stream.pipe(fs.createWriteStream('msg-' + seqno + '-body.txt'));
        });
        msg.once('attributes', function (attrs) {
          console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
        });
        msg.once('end', function () {
          console.log(prefix + 'Finished');
        });
      });
      f.once('error', function (err) {
        console.log('Fetch error: ' + err);
      });
      f.once('end', function () {
        console.log('Done fetching all messages!');
        imap.end();
      });
    });
  });

});

imap.once('error', function (err) {
  console.log(err);
});

imap.once('end', function () {
  console.log('Connection ended');
});

imap.connect();
// *** end mail client




module.exports = router;
