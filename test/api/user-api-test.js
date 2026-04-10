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

  test("update a user via API", async () => {
    const user = await waterfallService.createUser({
      firstName: "Old",
      lastName: "Name",
      email: "old@example.com",
      password: "secret",
    });

    await waterfallService.authenticate({
      email: user.email,
      password: user.password,
    });

    const updated = await waterfallService.updateUser(user._id, {
      firstName: "New",
      lastName: "Name",
      email: "new@example.com",
      password: "secret",
    });

    assert.equal(updated.firstName, "New");
    assert.equal(updated.email, "new@example.com");
  });

  test("update user - invalid id", async () => {
    const newUser = await waterfallService.createUser(maggie);
    await waterfallService.authenticate({
      email: newUser.email,
      password: newUser.password,
    });
    try {
      await waterfallService.updateUser("bad-id", {
        firstName: "Nope",
      });
      assert.fail("Should not succeed");
    } catch (error) {
      assert.equal(error.response.data.message, "No user with this id");
    }
  });

  test("partial update via API", async () => {
    const newUser = await waterfallService.createUser(maggie);
    await waterfallService.authenticate({
      email: newUser.email,
      password: newUser.password,
    });

    const updatedUser = structuredClone(newUser);
    updatedUser.firstName = "Partial";

    const updated = await waterfallService.updateUser(newUser._id, updatedUser);

    assert.equal(updated.firstName, "Partial");
    assert.equal(updated.email, newUser.email);
  });
});
