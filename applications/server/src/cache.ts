import type { EntityManager, Orm } from './types';

class CacheNode {
	constructor(key: UUID, orm: Orm, next: CacheNode | null = null, prev: CacheNode | null = null) {
		this.key = key;
		this.orm = orm;
		this.em = orm.em.fork();
		this.next = next;
		this.prev = prev;
	}

	// key represents headers[Headers.User] ?? headers[Headers.DockerUser]
	key: string;
	orm: Orm;
	em: EntityManager;
	next: CacheNode | null;
	prev: CacheNode | null;
}

export class EntityCacheManager {
	constructor(mainOrm: Orm, limit = 3) {
		this.size = 0;
		this.limit = limit;
		this.head = null;
		this.tail = null;
		this.orm = mainOrm;
		this.em = mainOrm.em.fork();

		this.map = new Map();
	}

	size: number;
	limit: number;
	head: CacheNode | null;
	tail: CacheNode | null;
	orm: Orm;
	em: EntityManager;
	map: Map<string, CacheNode>;

	write(key: string, orm: Orm): CacheNode {
		const node = new CacheNode(key, orm);
		this.map.set(key, node);
		this.size++;
		this.insertAtHead(node);
		if (this.size === this.limit) {
			this.deleteTail();
		}
		return node;
	}

	delete(key: string) {
		const node = this.map.get(key);
		if (node) {
			this.size--;
			node.em.clear();
			node.orm.close();
			this.map.delete(key);
			this.detach(node);
		}
	}

	promoteNode(node: CacheNode) {
		if (this.head !== node) {
			this.detach(node);
			this.insertAtHead(node);
		}
	}

	deleteTail() {
		const savedTail = this.tail;
		if (savedTail) {
			this.size--;
			savedTail.em.clear();
			savedTail.orm.close();
			this.map.delete(savedTail.key);
			this.detach(savedTail);
		}
	}

	insertAtHead(node: CacheNode) {
		const savedHead = this.head;
		if (savedHead) {
			savedHead.prev = node;
			node.next = savedHead;
			this.head = node;
		} else {
			this.head = node;
		}
	}

	read(key: string): EntityManager | undefined {
		const existingNode = this.map.get(key);
		if (existingNode) {
			this.promoteNode(existingNode);
			return existingNode.em;
		}
		return undefined;
	}

	forkProject(key: string | null): EntityManager | undefined {
		if (key) {
			const existingNode = this.map.get(key);
			if (existingNode) {
				existingNode.em.clear();
				return existingNode.em;
			}
		}
		return undefined;
	}

	forkMain(): EntityManager {
		this.em.clear();
		return this.em;
	}

	detach(node: CacheNode) {
		if (node.prev === null) {
			// if this was already head,
			this.head = node.next;
		} else {
			node.prev.next = node.next;
		}

		if (node.next === null) {
			// if this node was tail
			this.tail = node.prev;
		} else {
			node.next.prev = node.prev;
		}
		node.prev = null;
		node.next = null;
	}

	// avoid using
	clear() {
		this.forEach((node) => {
			node.em.clear();
		});
		this.head = null;
		this.tail = null;
		this.size = 0;
		this.map = new Map();
	}

	// Invokes the callback function with every node of the chain and the index of the node.
	forEach(fn: (node: CacheNode, index: number) => void) {
		let node = this.head;
		let counter = 0;
		while (node) {
			fn(node, counter);
			node = node.next;
			counter++;
		}
	}

	// To iterate over LRU with a 'for...of' loop
	*[Symbol.iterator]() {
		let node = this.head;
		while (node) {
			yield node;
			node = node.next;
		}
	}
}
