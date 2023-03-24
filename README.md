# Hack Your Future challenge

Create an express server than communicates with a simple frontend application over localhost:3001
We already build a very basic frontend and setup a very basic express template to get you going. 

The project consists of two folders - one for the frontend and one for the express server. Start out by running the frontend application by navigating into the frontend project and run `npm run dev`. Open a browser and navigate to localhost:3000.

Afterwards continue implementing the different tasks specified below. Each task in the list below has a designated button in the frontend that will call the specified endpoints.

Stores API documentation https://developer.sallinggroup.com/api-reference#apis-stores

# Task one:

Create an endpoint `/stores/` that fetches all Bilka stores from SallingGroups public stores API(To avoid having to handle pagination you can set a page size to 100). The API-key can be found in the top of the express server template. 

# Task two:

Create an endpoint `/sorted-stores/` that sorts the stores based. (Could be alphabetically based on the name) 

# Task three:

Create an endpoint `/stores/:storeId` that can fetch data for a single store. (The response should still be an array but just only contain one element)

# Task four:

Create an endpoint `/find-nearby-stores/:distance` that can find stores nearby Salling Group headquarters (coordinates to use: 56.162387,10.0078135) 

# Bonus tasks:

- Clean up the response from the API-gateway making sure that the express server only expose data the frontend needs. The frontend only need the store name and the opening hours with type: "store"
- Prettify the frontend layer by applying some simple styling.
- Simple error handling. Not currently supported in the frontend (A simple error response could be shown in the frontend but it requires some changes to how to frontend code is built.

