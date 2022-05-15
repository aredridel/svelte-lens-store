import type { Updater, Writable } from 'svelte/store';

export interface PropertyLens<T> extends Writable<T> {
	at<U extends keyof T>(subProp: U): PropertyLens<T[U]>;
}

export const EMPTY = Symbol('empty');

/**
 * A store that focuses on just part of an outer store
 */
export function focusOnProperty<T, U extends keyof T>(
	store: Writable<T>,
	prop: U
): PropertyLens<T[U]> {
	return {
		subscribe(fn: (x: T[U]) => void) {
			let last: typeof EMPTY | T[U] = EMPTY;
			return store.subscribe((val) => {
				const x = val ? val[prop] : EMPTY;
				if (x !== last && x !== EMPTY) {
					last = x;
					fn(last);
				}
			});
		},

		set(x) {
			store.update((val) => {
				val[prop] = x;
				return val;
			});
		},

		update(fn) {
			store.update((val) => {
				val[prop] = fn(val[prop]);
				return val;
			});
		},

		at<V extends keyof T[U]>(subProp: V) {
			return focusOnProperty(this, subProp);
		}
	};
}

export function bijectiveMapping<T, U>(
	store: Writable<T>,
	mapOut: (val: T) => U,
	mapIn: (val: U) => T
): Writable<U> {
	return {
		subscribe(fn: (x: U) => void): () => void {
			return store.subscribe((val) => {
				return fn(mapOut(val));
			});
		},
		set(val: U): void {
			return store.set(mapIn(val));
		},
		update(updater: Updater<U>): void {
			return store.update((val) => {
				return mapIn(updater(mapOut(val)));
			});
		}
	};
}
