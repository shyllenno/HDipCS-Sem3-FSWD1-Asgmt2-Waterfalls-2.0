import { assert } from "chai";
import { waterfallService } from "./waterfall-service.js";
import { assertSubset } from "../test-utils.js";
import { maggie, maggieCredentials, testUsers as base } from "../fixtures.js";
import { db } from "../../src/models/db.js";
import { decodeToken } from "../../src/api/jwt-utils.js";

let testUsers = [];

suite("User API tests", () => {
  setup(async () => {
    waterfallService.clearAuth();
    await waterfallService.createUser(maggie);
    await waterfallService.authenticate(maggieCredentials);
    await waterfallService.deleteAllUsers();
    testUsers = [];

    for (let i = 0; i < base.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testUsers[i] = await waterfallService.createUser(base[i]);
    }
  });

  test("create a user", async () => {
    const newUser = await waterfallService.createUser(maggie);
    assertSubset(maggie, newUser);
    assert.isDefined(newUser._id);
  });

  test("delete all users", async () => {
    let newUser = await waterfallService.createUser(maggie);
    await waterfallService.authenticate(maggieCredentials);
    let returnedUsers = await waterfallService.getUsers();
    assert.equal(returnedUsers.length, 4);

    await waterfallService.deleteAllUsers();

    newUser = await waterfallService.createUser(maggie);
    await waterfallService.authenticate(maggieCredentials);
    returnedUsers = await waterfallService.getUsers();
    assert.equal(returnedUsers.length, 1);
  });

  test("get a user - success", async () => {
    const newUser = await waterfallService.createUser(maggie);
    await waterfallService.authenticate(maggieCredentials);
    const returnedUser = await waterfallService.getUser(testUsers[0]._id);
    assert.deepEqual(testUsers[0], returnedUser);
  });

  test("get a user - fail", async () => {
    const newUser = await waterfallService.createUser(maggie);
    await waterfallService.authenticate(maggieCredentials);
    try {
      const returnedUser = await waterfallService.getUser("1234");
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No User with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });

  test("get a user - deleted user", async () => {
    let newUser = await waterfallService.createUser(maggie);
    await waterfallService.authenticate(maggieCredentials);
    const deletedUser = await waterfallService.getUser(testUsers[0]._id);
    await waterfallService.deleteAllUsers();

    try {
      newUser = await waterfallService.createUser(maggie);
      await waterfallService.authenticate(maggieCredentials);
      const returnedUser = await waterfallService.getUser(deletedUser._id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No User with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });
});
