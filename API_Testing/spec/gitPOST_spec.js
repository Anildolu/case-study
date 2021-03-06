// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const config = require('../config');
const expect = chai.expect;

chai.should();
chai.use(chaiHttp);

// Get the URL for git API
let restURL = function () {
  return config.restBaseUrl + '/';
};

describe('POST -Test Scenario', () => {
  let postpayload = {
    base: "master",
    head: "Anildolu-patch-4",
    commit_message: "Shipped cool_feature!"
  };

  it(`TC-01 : test the git mearge`, (done) => {
    chai.request(restURL())
      .post('repos/Anildolu/Case-Study/merges')
      .send(postpayload)
      .set('Authorization', config.basicAuth)
      .end((err, res) => {
        res.should.have.status(201);
        done();
      });
  });

  it(`TC-02 : test the git merge with invalid branch`, (done) => {
    let postpayload1 = {
      base: "master",
      head: "Anildolu-patch-5",
      commit_message: "Shipped cool_feature!"
    };
    chai.request(restURL())
      .post('repos/Anildolu/Case-Study/merges')
      .send(postpayload1)
      .set('Authorization', config.basicAuth)
      .end((err, res) => {
        res.should.have.status(404);
        expect(res.body.message).to.contains("Head does not exist");
        expect(res.body.documentation_url).to.contains("https://developer.github.com/v3/repos/merging/#perform-a-merge");
        done();
      });
  });

  it(`TC-03 : test the gitrepo creation`, (done) => {
    let postpayload3 = {
      name: "Hello-World",
      description: "This is your first repository",
      homepage: "https://github.com",
      private: false,
      has_issues: true,
      has_projects: true,
      has_wiki: true
    };
    chai.request(restURL())
      .post('user/repos')
      .send(postpayload3)
      .set('Authorization', config.basicAuth)
      .end((err, res) => {
        res.should.have.status(201);
        expect(res.body.name).to.be.equal("Hello-World");
        expect(res.body.full_name).to.be.equal("Anildolu/Hello-World");
        expect(res.body.owner.login).to.be.equal("Anildolu");
        done();
      });
  });

  it(`TC-04 : test the gitrepo creation with duplicate data`, (done) => {
    let postpayload2 = {
      name: "Hello-World",
      description: "This is your first repository",
      homepage: "https://github.com",
    };
    chai.request(restURL())
      .post('user/repos')
      .send(postpayload2)
      .set('Authorization', config.basicAuth)
      .end((err, res) => {
        res.should.have.status(422);
        expect(res.body.message).to.be.equal("Repository creation failed.");
        expect(res.body.errors[0].message).to.be.equal("name already exists on this account");
        done();
      });
  });

});
