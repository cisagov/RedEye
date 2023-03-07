/// <reference types="cypress" />

export const graphqlRequest = (query, variables) => {
	return cy
		.request({
			method: 'POST',
			url: 'http://localhost:4000/api/graphql',
			body: { query, variables },
			failOnStatusCode: true,
		})
		.then((res) => {
			expect(res.status).to.eq(200);
			return res;
		});
};

export const mutRequest = (mutation, variables) => {
	return cy
		.request({
			method: 'POST',
			url: 'http://localhost:4000/api/graphql',
			body: { query: mutation, variables },
			failOnStatusCode: true,
		})
		.then((res) => {
			expect(res.status).to.eq(200);
			return res;
		});
};
