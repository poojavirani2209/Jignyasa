export class LRUCache {
  maxCapacity: number;
  cacheItems: Map<string, ListNode>;
  ttl: number;

  head: ListNode;
  tail: ListNode;

  constructor(maxCapacity: number, ttl: number) {
    this.maxCapacity = maxCapacity;
    this.ttl = ttl;
    this.cacheItems = new Map<string, ListNode>();
  }

  addNewItem(cacheItem: string) {
    if (this.head == null) {
      this.head = new ListNode(cacheItem, this.ttl);
      this.tail = this.head;
    } else {
      if (this.cacheItems.size >= this.maxCapacity) {
        this.removeLRU();
      }
      let newItem = new ListNode(cacheItem, this.ttl);
      this.tail.next = newItem;
      newItem.prev = this.tail;
      this.tail = newItem;
    }
    this.cacheItems.set(cacheItem, this.tail);
  }

  removeLRU() {
    this.cacheItems.delete(this.head.value);
    this.head.next.prev = null;
    this.head = this.head.next;
  }

  removeItem(cacheItem: string) {
    if (this.tail.value == cacheItem) {
      this.tail.prev.next = null;
      this.tail = this.tail.prev;
    } else if (this.head.value == cacheItem) {
      this.removeLRU();
    } else {
      let cacheNode = this.cacheItems.get(cacheItem);
      cacheNode.prev = cacheNode.next.prev;
      cacheNode.prev.next = cacheNode.next;
    }
    this.cacheItems.delete(cacheItem);
  }

  printCacheItems() {
    this.cacheItems.forEach((item) => {
      console.log(`${item.value}->`);
    });
  }

  deleteExpiredItems(pollingValue: number) {
    setInterval(() => {
      let currentDate = Date.now();
      this.cacheItems.forEach((item) => {
        if (item.ttl < currentDate) {
          this.removeItem(item.value);
        }
      });
    }, pollingValue);
  }

  getItem(cacheItem: string) {
    let node = this.cacheItems.get(cacheItem);
    if (node) {
      this.moveToTail(node);

      return node.value;
    }
  }

  getItemValueInJSON(cacheItem: string) {
    let node = this.cacheItems.get(cacheItem);
    if (!node) {
      return undefined;
    }
    this.moveToTail(node);

    return JSON.parse(node.value);
  }

  checkIfExpired(cacheItem: ListNode): boolean {
    if (cacheItem.ttl > Date.now()) {
      this.removeItem(cacheItem.value);
      return true;
    } else return false;
  }

  moveToTail(cacheItem: ListNode) {
    if (this.tail == cacheItem) {
      return;
    } else if (this.head == cacheItem) {
      this.head = this.head.next;
      this.head.prev = null;
    } else {
      cacheItem.next.prev = cacheItem.prev;
      cacheItem.prev.next = cacheItem.next;
    }
    this.tail.next = cacheItem;
    cacheItem.prev = this.tail;
    cacheItem.next = null;
    this.tail = cacheItem;
  }

  printLL() {
    let node = this.head;
    while (node != null) {
      console.log(`${node.value}->`);
      node = node.next;
    }
  }
}

class ListNode {
  next: ListNode;
  prev: ListNode;
  value: string;
  ttl: number;

  constructor(value: string, ttl: number) {
    this.value = value;
    this.next = null;
    this.prev = null;
    this.ttl = Date.now() + ttl;
  }
}
