const chai = require('chai');
const assert = chai.assert;

const server = require('../server');

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

suite('Functional Tests', function () {
  this.timeout(5000);
  suite('Integration tests with chai-http', function () {
    // #1
    test('Test GET /hello with no name', function (done) {
      chai
        .request(server)
        .keepOpen()
        .get('/hello')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'hello Guest');
          done();
        });
    });
    // #2
    test('Test GET /hello with your name', function (done) {
      chai
        .request(server)
        .keepOpen()
        .get('/hello?name=xy_z')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'hello xy_z');
          done();
        });
    });
    // #3
    test('Send {surname: "Colombo"}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put('/travellers')
        .send({surname: "Colombo"})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json')
          assert.equal(res.body.name, 'Cristoforo')
          assert.equal(res.body.surname, 'Colombo')
          done();
        });
    });
    // #4
    test('Send {surname: "da Verrazzano"}', function (done) 
    {
      chai
      .request(server)
      .put('/travellers')
      .send({surname: "da Verrazzano"})
      .end(function(err,res)
      {
        assert.equal(res.status, 200)
        assert.equal(res.type, 'application/json')
        assert.equal(res.body.name, 'Giovanni')
        assert.equal(res.body.surname, 'da Verrazzano')
        done();
      });
    });
  });
});

const Browser = require('zombie');
//const assert = require('chai').assert;

// Menetapkan URL proyek Anda
Browser.site = 'http://0.0.0.0:3000'; // URL Anda di sini

// Membuat objek Browser baru
const browser = new Browser();

suite('Functional Tests with Zombie.js', function () {
  this.timeout(5000); // Mengatur timeout menjadi 5 detik

  // Hook untuk mengunjungi URL sebelum tes dijalankan
  suiteSetup(function(done) {
    return browser.visit('/', done);
  });

  suite('Headless browser', function () {
    test('should have a working "site" property', function() {
      assert.isNotNull(browser.site);
    });
  });

  suite('"Famous Italian Explorers" form', function () {

    // Tes untuk submit dengan surname "Colombo"
    test('Submit the surname "Colombo" in the HTML form', function (done) {
      browser.fill('surname', 'Colombo').then(() => {
        browser.pressButton('submit', () => {
          browser.assert.success();
          browser.assert.text('span#name', 'Cristoforo');
          browser.assert.text('span#surname', 'Colombo');
          browser.assert.elements('span#dates', 1);
          done();
        });
      });
    });

    // Tes untuk submit dengan surname "Vespucci"
    test('Submit the surname "Vespucci" in the HTML form', function (done) {
      browser.fill('surname', 'Vespucci').then(() => {
        browser.pressButton('submit', () => {
          browser.assert.success();
          browser.assert.text('span#name', 'Amerigo');
          browser.assert.text('span#surname', 'Vespucci');
          browser.assert.elements('span#dates', 1);
          done();
        });
      });
    });
  });
});