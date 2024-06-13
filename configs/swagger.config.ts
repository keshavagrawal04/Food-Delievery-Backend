export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Food Delivery API",
    version: "1.0.0",
    description: "API documentation for the Food Delivery web application",
  },
  servers: [
    {
      url: "http://localhost:8000",
    },
  ],
  paths: {
    "/admin/vendors": {
      get: {
        tags: ["Vendors"],
        summary: "Get all vendors",
        responses: {
          "200": {
            description: "A list of vendors",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Vendor",
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Vendors"],
        summary: "Create a new vendor",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/NewVendor",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Vendor created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Vendor",
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/vendors/{id}": {
      get: {
        tags: ["Vendors"],
        summary: "Get a vendor by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            description: "ID of the vendor to retrieve",
          },
        ],
        responses: {
          "200": {
            description: "Vendor details",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Vendor",
                },
              },
            },
          },
          "404": {
            description: "Vendor not found",
          },
        },
      },
      put: {
        tags: ["Vendors"],
        summary: "Update a vendor by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            description: "ID of the vendor to update",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/NewVendor",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Vendor updated successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Vendor",
                },
              },
            },
          },
          "404": {
            description: "Vendor not found",
          },
        },
      },
      delete: {
        tags: ["Vendors"],
        summary: "Delete a vendor by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            description: "ID of the vendor to delete",
          },
        ],
        responses: {
          "204": {
            description: "Vendor deleted successfully",
          },
          "404": {
            description: "Vendor not found",
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Vendor: {
        type: "object",
        properties: {
          id: {
            type: "string",
            example: "507f191e810c19729de860ea",
          },
          name: {
            type: "string",
            example: "Example Vendor",
          },
          ownerName: {
            type: "string",
            example: "John Doe",
          },
          foodType: {
            type: "array",
            items: {
              type: "string",
            },
            example: ["Pizza", "Burgers", "Pasta"],
          },
          pinCode: {
            type: "string",
            example: "123456",
          },
          address: {
            type: "string",
            example: "123 Main Street",
          },
          phone: {
            type: "string",
            example: "123-456-7890",
          },
          email: {
            type: "string",
            example: "example@example.com",
          },
        },
      },
      NewVendor: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          ownerName: {
            type: "string",
          },
          foodType: {
            type: "array",
            items: {
              type: "string",
            },
          },
          pinCode: {
            type: "string",
          },
          address: {
            type: "string",
          },
          phone: {
            type: "string",
          },
          email: {
            type: "string",
          },
          password: {
            type: "string",
          },
        },
        required: [
          "name",
          "ownerName",
          "foodType",
          "pinCode",
          "address",
          "phone",
          "email",
          "password",
        ],
      },
    },
  },
};
