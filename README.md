# Hack Your Future challenge

Create an express server than communicates with a simple frontend application over localhost:3001
We already build a very basic frontend and setup a very basic express template to get you going. 

Stores API documentation https://developer.sallinggroup.com/api-reference#apis-stores

# Task one:

Create an endpoint `/stores/` that fetches all Bilka stores from SallingGroups public stores API. The API-key can be found in the top of the express server template. 

# Task two:

Create an endpoint `/sorted-stores/` that sorts the stores alphabetically based on the store name.

# Task three:

Create an endpoint `/stores/:storeId` that can fetch data for a single store. (The response should still be an array but just only contain one element)

# Task four:

Create an endpoint `/find-nearby-stores/:distance` that can find stores nearby Salling Group headquarters (coordinates to use: 56.162387,10.0078135) 

# Bonus tasks:

- Clean up the response from the API-gateway making sure that the express server only expose data the frontend needs. The frontend only need the store name and the opening hours with type: "store"
- Prettify the frontend layer by applying some simple styling.
- Simple error handling. Not currently supported in the frontend.

