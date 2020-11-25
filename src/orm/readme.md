# Aether ORM

## What is Aether ORM?

Aether ORM is addon/util to Aether that allows you to store structures outside of memory via database rather than in-memory with `Collection`. Why would you want to this? There are alot of reasons but mainly because `Collection` extends `Map` and since these Maps will end up being very large in size, they will end up taking up alot of RAM. To counteract this, we can use a cloud-based DB like Mongo or a disk-based (SQL) DB like Sqlite3 or PostgreSQL.

## How do I set it up

Natively, Aether does **NOT** enable the ORM by default. To enable ORM mode, the following syntax works:

```ts
const client = new Client({
	cache: {
		db: {
			use: true,
			type: 'mongo',
		},
	},
});

// or

client.useORM({ type: 'mongo' });

// or

client.orm = new Aether.ORM({ type: 'mongo' });
```

Note: You must actually have the drivers for the respect DB flavor installed (for instance, you should have the URI/username & password for MongoDB)

## ORM API

```ts
const client = new Client('123');
client.useORM({ type: 'mongo' });

class Person {
	public name: string;
	public age: number;
	public gender: 'male' | 'female' | 'non-binary';

	public constructor(
		name: string,
		age: number,
		gender: 'male' | 'female' | 'non-binary'
	) {
		this.name = name;
		this.age = age;
		this.gender = gender;
	}
}

client.registerStructure(Person, 'people');
// Argument 1: Actual class/structure
// Arguemnt 2: What should the collection of the structure be called

const person = new Person('Cqdet', 15, 'male');

await client.orm.asMongo().save(person);
// If using sqlite3 or SQL-based flavor
// await client.orm.asSQL().query("INSERT INTO people (name, age, gender) VALUES ('Cqdet', 15, 'male')")

const personFromDB = await client.orm.asMongo().findOne({ name: 'Cqdet' });
// If using sqlite3 or SQL-based flavor
// cosnt personFromDB =  await client.orm.asSQL().query("SELECT name FROM people WHERE name = 'Cqdet'")
// NOTE: I am fairly rusty with my SQL skills so this may be wrong ^ :)
```
