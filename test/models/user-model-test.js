import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { maggie, testUsers as base } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

let testUsers = [];

suiteSetup(async () => {
  await db.init("mongo");
});

suiteTeardown(async () => {
  await db.close();
});

suite("User Model tests", () => {
  setup(async () => {
    await db.userStore.deleteAll();

    testUsers = [];

    for (let i = 0; i < base.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testUsers[i] = await db.userStore.addUser({ ...base[i] });
    }
  });

  test("create a user", async () => {
    const newUser = await db.userStore.addUser(maggie);
    assertSubset(maggie, newUser);
  });

  test("delete all userApi", async () => {
    let returnedUsers = await db.userStore.getAllUsers();
    assert.equal(returnedUsers.length, 3);
    await db.userStore.deleteAll();
    returnedUsers = await db.userStore.getAllUsers();
    assert.equal(returnedUsers.length, 0);
  });

  test("get a user - success", async () => {
    const user = await db.userStore.addUser(maggie);
    const returnedUser1 = await db.userStore.getUserById(user._id);
    assert.deepEqual(user, returnedUser1);
    const returnedUser2 = await db.userStore.getUserByEmail(user.email);
    assert.deepEqual(user, returnedUser2);
  });

  test("delete One User - success", async () => {
    await db.userStore.deleteUserById(testUsers[0]._id);
    const returnedUsers = await db.userStore.getAllUsers();
    assert.equal(returnedUsers.length, testUsers.length - 1);
    const deletedUser = await db.userStore.getUserById(testUsers[0]._id);
    assert.isNull(deletedUser);
  });

  test("get a user - failures", async () => {
    const noUserWithId = await db.userStore.getUserById("123");
    assert.isNull(noUserWithId);
    const noUserWithEmail = await db.userStore.getUserByEmail("no@one.com");
    assert.isNull(noUserWithEmail);
  });

  test("get a user - bad params", async () => {
    let nullUser = await db.userStore.getUserByEmail("");
    assert.isNull(nullUser);
    nullUser = await db.userStore.getUserById("");
    assert.isNull(nullUser);
    nullUser = await db.userStore.getUserById();
    assert.isNull(nullUser);
  });

  test("delete One User - fail", async () => {
    await db.userStore.deleteUserById("bad-id");
    const allUsers = await db.userStore.getAllUsers();
    assert.equal(testUsers.length, allUsers.length);
  });

  test("update a user - success", async () => {
    const user = await db.userStore.addUser({
      firstName: "Old",
      lastName: "Name",
      email: "old@example.com",
      password: "secret",
    });

    const updated = await db.userStore.updateUser(user._id, {
      firstName: "New",
      lastName: "Name",
      email: "new@example.com",
      password: "secret",
    });

    assert.equal(updated.firstName, "New");
    assert.equal(updated.email, "new@example.com");
  });

  test("update a user - invalid id", async () => {
    const updated = await db.userStore.updateUser("bad-id", {
      firstName: "Should Not Work",
    });

    assert.isNull(updated);
  });

  test("partial update - success", async () => {
    const user = await db.userStore.addUser(maggie);

    const updateUser = {
      firstName: "Partial",
    };

    const updated = await db.userStore.updateUser(user._id, updateUser);

    assert.equal(updated.firstName, "Partial");
    assert.equal(updated.email, user.email);
  });
});
