/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
/* tslint:disable */
import { assert } from "chai";

import { FetchOptions } from "../../../src/IFetchOptions";
import { appendRequestHeader, generateUUID, getRequestHeader, setRequestHeader } from "../../../src/middleware/MiddlewareUtil";
import { GRAPH_BASE_URL } from "../../../src/Constants";

describe("MiddlewareUtil.ts", async () => {
	function getMultipleValuesForHeader(headers: Headers, key: string): string[] {
		return headers
			.get(key)
			.split(",")
			.map(function(item) {
				return item.trim();
			});
	}

	describe("getRequestHeader", () => {
		const key = "Content-Type";
		const value = "application/json";
		const url = GRAPH_BASE_URL + "/dummy_url";
		it("Should get header from request object", () => {
			const request: Request = new Request(url, {
				method: "test",
				headers: {
					version: "version",
					[key]: value,
				},
			});
			const headerValue: string = getRequestHeader(request, undefined, key);
			assert.equal(headerValue, value);
		});

		it("Should get header from headers object", () => {
			const options: FetchOptions = {
				method: "test",
				headers: {
					version: "version",
					[key]: value,
				},
			};
			const headerValue: string = getRequestHeader(url, options, key);
			assert.equal(headerValue, value);
		});

		it("Should get header from Headers instance", () => {
			const options: FetchOptions = {
				method: "test",
				headers: new Headers({
					version: "version",
					[key]: value,
				}),
			};
			const headerValue: string = getRequestHeader(url, options, key);
			assert.equal(headerValue, value);
		});

		it("Should get header from array of headers", () => {
			const options: FetchOptions = {
				method: "test",
				headers: [
					["version", "version"],
					[key, value],
				],
			};
			const headerValue: string = getRequestHeader(url, options, key);
			assert.equal(headerValue, value);
		});
	});

	describe("setRequestHeader", () => {
		const key = "Content-Type";
		const value = "application/json";
		const url = GRAPH_BASE_URL + "dummy_url";
		it("Should set header in request object", () => {
			const request: Request = new Request(url, {
				method: "test",
				headers: {
					version: "version",
				},
			});
			setRequestHeader(request, undefined, key, value);
			assert.equal(request.headers.get(key), value);
		});

		it("Should replace header in request object if the header is already present", () => {
			const request: Request = new Request(url, {
				method: "test",
				headers: {
					version: "version",
					[key]: value,
				},
			});
			setRequestHeader(request, undefined, key, value);
			assert.equal(request.headers.get(key), value);
		});

		it("Should set header for empty headers", () => {
			const options: FetchOptions = {
				method: "test",
			};
			setRequestHeader(url, options, key, value);
			assert.isDefined(options.headers);
			assert.equal((options.headers as Headers).get(key), value);
		});

		it("Should set header in headers object", () => {
			const options: FetchOptions = {
				method: "test",
				headers: {
					version: "version",
				},
			};
			setRequestHeader(url, options, key, value);
			assert.equal(options.headers[key], value);
		});

		it("Should replace header in headers object if header is already present", () => {
			const options: FetchOptions = {
				method: "test",
				headers: {
					version: "version",
					[key]: value,
				},
			};
			setRequestHeader(url, options, key, value);
			assert.equal(options.headers[key], value);
		});

		it("Should set header in Headers instance", () => {
			const options: FetchOptions = {
				method: "test",
				headers: new Headers({ version: "version" }),
			};
			setRequestHeader(url, options, key, value);
			assert.isDefined(options.headers);
			assert.equal((options.headers as Headers).get(key), value);
		});

		it("Should replace header in Headers instance if header is already present", () => {
			const options: FetchOptions = {
				method: "test",
				headers: new Headers({ version: "version", [key]: value }),
			};
			setRequestHeader(url, options, key, value);
			assert.isDefined(options.headers);
			assert.equal((options.headers as Headers).get(key), value);
		});

		it("Should set header in array of headers", () => {
			const options: FetchOptions = {
				method: "test",
				headers: [["version", "version"]],
			};
			setRequestHeader(url, options, key, value);
			assert.isDefined(options.headers);
			assert.equal(options.headers[1][1], value);
		});

		it("Should replace header in array of headers if header is already present", () => {
			const options: FetchOptions = {
				method: "test",
				headers: [[key, "dummy/type"]],
			};
			setRequestHeader(url, options, key, value);
			assert.isDefined(options.headers);
			assert.equal((options.headers as string[][]).length, 1);
			assert.equal(options.headers[0][0], key);
			assert.equal(options.headers[0][1], value);
		});
	});

	describe("appendRequestHeader", () => {
		const key = "Content-Type";
		const value = "application/json";
		const firstValue = "text/html";
		const url = GRAPH_BASE_URL + "dummy_url";
		it("Should set header in request object if the header is not present", () => {
			const request: Request = new Request(url, {
				method: "test",
				headers: {
					version: "version",
				},
			});
			appendRequestHeader(request, undefined, key, value);
			assert.equal(request.headers.get(key), value);
		});

		it("Should append header in request object", () => {
			const request: Request = new Request(url, {
				method: "test",
				headers: {
					version: "version",
					[key]: firstValue,
				},
			});
			appendRequestHeader(request, undefined, key, value);
			const values = getMultipleValuesForHeader(request.headers, key);
			assert.equal(values[0], firstValue);
			assert.equal(values[1], value);
		});

		it("Should append header in request object even if the value is duplicate", () => {
			const request: Request = new Request(url, {
				method: "test",
				headers: {
					version: "version",
					[key]: value,
				},
			});
			appendRequestHeader(request, undefined, key, value);
			const values = getMultipleValuesForHeader(request.headers, key);
			assert.equal(values[0], value);
			assert.equal(values[1], value);
		});

		it("Should set header for empty headers", () => {
			const options: FetchOptions = {
				method: "test",
			};
			appendRequestHeader(url, options, key, value);
			assert.isDefined(options.headers);
			assert.equal((options.headers as Headers).get(key), value);
		});

		it("Should set header in headers object if header is not present", () => {
			const options: FetchOptions = {
				method: "test",
				headers: {
					version: "version",
				},
			};
			appendRequestHeader(url, options, key, value);
			assert.equal(options.headers[key], value);
		});

		it("Should append header in headers object", () => {
			const options: FetchOptions = {
				method: "test",
				headers: {
					version: "version",
					[key]: firstValue,
				},
			};
			appendRequestHeader(url, options, key, value);
			assert.equal(options.headers[key], `${firstValue}, ${value}`);
		});

		it("Should append header in headers object even if the value is duplicate", () => {
			const options: FetchOptions = {
				method: "test",
				headers: {
					version: "version",
					[key]: value,
				},
			};
			appendRequestHeader(url, options, key, value);
			assert.equal(options.headers[key], `${value}, ${value}`);
		});

		it("Should set header in Headers instance if header is not present", () => {
			const options: FetchOptions = {
				method: "test",
				headers: new Headers({ version: "version" }),
			};
			appendRequestHeader(url, options, key, value);
			assert.isDefined(options.headers);
			assert.equal((options.headers as Headers).get(key), value);
		});

		it("Should append header in Headers instance", () => {
			const options: FetchOptions = {
				method: "test",
				headers: new Headers({ version: "version", [key]: firstValue }),
			};
			appendRequestHeader(url, options, key, value);
			assert.isDefined(options.headers);
			const values = getMultipleValuesForHeader(options.headers as Headers, key);
			assert.equal(values[0], firstValue);
			assert.equal(values[1], value);
		});

		it("Should append header in Headers instance even if the value is duplicate", () => {
			const options: FetchOptions = {
				method: "test",
				headers: new Headers({ version: "version", [key]: value }),
			};
			appendRequestHeader(url, options, key, value);
			assert.isDefined(options.headers);
			const values = getMultipleValuesForHeader(options.headers as Headers, key);
			assert.equal(values[0], value);
			assert.equal(values[1], value);
		});

		it("Should set header in array of headers if the header is not present", () => {
			const options: FetchOptions = {
				method: "test",
				headers: [["version", "version"]],
			};
			appendRequestHeader(url, options, key, value);
			assert.isDefined(options.headers);
			assert.equal(options.headers[1][1], value);
		});

		it("Should append header in array of headers", () => {
			const options: FetchOptions = {
				method: "test",
				headers: [[key, firstValue]],
			};
			appendRequestHeader(url, options, key, value);
			assert.isDefined(options.headers);
			assert.equal((options.headers as string[][]).length, 2);
			assert.equal(options.headers[0][0], key);
			assert.equal(options.headers[0][1], firstValue);
			assert.equal(options.headers[1][0], key);
			assert.equal(options.headers[1][1], value);
		});

		it("Should append header in array of headers even if the value is duplicate", () => {
			const options: FetchOptions = {
				method: "test",
				headers: [[key, value]],
			};
			appendRequestHeader(url, options, key, value);
			assert.isDefined(options.headers);
			assert.equal((options.headers as string[][]).length, 2);
			assert.equal(options.headers[0][0], key);
			assert.equal(options.headers[0][1], value);
			assert.equal(options.headers[1][0], key);
			assert.equal(options.headers[1][1], value);
		});
	});

	describe("generateUUID", () => {
		it("Should return the unique uuid", () => {
			const uuid = generateUUID();
			assert.equal(uuid.length, 36);
		});
	});
});
