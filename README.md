# Ecomus

Ecomus is a web application designed to bridge the gap between local producers, artisans, and consumers within their communities. Built using the Next.js framework for the front-end, Flask (Python) for the back-end, and MySQL for the database, Ecomus serves as a platform promoting sustainable consumption, supporting local economies, and reducing the carbon footprint associated with long-distance shipping.

## Project Overview

In many communities, local producers and artisans face challenges in connecting with nearby consumers. This disconnect often results in economic hardships and a reliance on long-distance shipping, which contributes to higher carbon emissions and less sustainable consumption patterns. Ecomus addresses these challenges by providing a platform where local producers can showcase their products to consumers in their area, fostering a more sustainable and locally-driven economy.

## Core Features

1. Market Discovery and Product Details

   - A landing page showcasing upcoming markets and detailed product information.
   - A responsive design that ensures optimal user experience across all devices.
   - Browse and filter products by category or location with a built-in search bar, including debounce, filters, and pagination for smooth navigation.

2. Market Transactions and Promotions

   - Sellers can create product listings, including details like name, price, description, available quantity, and product type.
   - Option to list products as standard or premium (eco-friendly/organic).
   - Sellers can create and manage discount vouchers for promotions.
   - A fully functional cart system for purchasing products, with prices displayed in the local currency (e.g., IDR).

3. User Authentication and Authorization

   - Two user roles: Consumers and Sellers.
   - Users must create an account to make purchases or list products.
   - Role-based access control ensures that users can only access the features relevant to their roles.

## Running the project

## Clone the Repository

    - git clone https://github.com/jonathaneverald/revou-fsse-gfp-group-k.git
    - cd revou-fsse-gfp-group-k/front-end

### Front-end instalations

#### Install dependencies:

        - npm install

#### Start the development server:

        - npm run dev

### Back-end instalations

#### Install dependencies:

        - pipenv install (if using virtual environment)
        - pip install

#### Start the development server:

        - flask run --debug
