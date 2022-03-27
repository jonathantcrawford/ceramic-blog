import cuid from "cuid";
import arc from "@architect/functions";
import bcrypt from "bcryptjs";
import invariant from "tiny-invariant";

export type User = { id: string; email: string };
export type Password = { password: string };

export async function getUserById(id: string): Promise<User | null> {
  const db = await arc.tables();
  const result = await db.user.query({
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: { ":pk": `user#${id}` },
  });

  const [record] = result.Items;
  if (record) return { id: record.pk.replace(/^user#/, ""), email: record.email.replace(/^email#/, "") };
  return null;
}

export async function getUserByEmail(email: string) {
  const db = await arc.tables();
  const result = await db.user.query({
    IndexName: 'byEmail',
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: { ":email": `email#${email}` },
  })

  const [record] = result.Items;
  if (record) return { id: record.pk.replace(/^user#/, ""), email: record.email.replace(/^email#/, "") };
  return null;
}

async function getUserPasswordByEmail(email: string) {
  const db = await arc.tables();
  const result = await db.password.query({
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: { ":pk": `email#${email}` },
  });

  const [record] = result.Items;

  if (record) return { hash: record.password };
  return null;
}

export async function createUser(email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const db = await arc.tables();

  await db.user.put({
    pk: `email#${email}`
  });

  console.log('unique email')

  const result = await db.user.put({
    pk: `user#${cuid()}`,
    email: `email#${email}`
  });

  console.log('create user', result);

  await db.password.put({
    pk: `email#${email}`,
    password: hashedPassword,
  });

  console.log('save hashed password')


  const user = await getUserByEmail(email);
  invariant(user, `User not found after being created. This should not happen`);

  return {
    id: user.id.replace(/^email#/, ""),
    email: user.email
  }
}

export async function deleteUser(email: string) {
  const db = await arc.tables();
  await db.password.delete({ pk: `email#${email}` });
  await db.user.delete({ pk: `user#${email}` });
}

export async function verifyLogin(email: string, password: string) {
  const userPassword = await getUserPasswordByEmail(email);

  if (!userPassword) {
    return undefined;
  }

  const isValid = await bcrypt.compare(password, userPassword.hash);
  if (!isValid) {
    return undefined;
  }

  return getUserByEmail(email);
}
