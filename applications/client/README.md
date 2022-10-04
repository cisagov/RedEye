# RedEye Client

The client is a React application using Mobx for state management and Blueprint for its component library.

To generate graphql models, run: `yarn nx run client:generate-graphql`

## Core Libraries

State Management: Mobx & Mobx Keystone
Routing: React Router
Component Library: Blueprint
Data Fetching: GraphQL (through mkgql) and Tanstack Query

## Structure

The client is split into three primary folders:

- [Store](./src/store): The global store and GraphQL models as Mobx Keystone classes
- [Views](./src/views): Each folder represents a view (loosely corresponding to its route) with components only used in that view
- [Components](./src/components): Reusable or similarly grouped components across views








