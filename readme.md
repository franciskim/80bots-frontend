![80bots front-end](public/images/80bots-logo.svg)

## SaaS front-end part

Next.js application

## Overview:

The app represents the web interface for managing, configuring and overviewing bots. 
It provides info about bots available for usage, works with existing bots and receiving bot's results in several ways (web interface, CSV).
The biggest part of the application interacts with the configured API and requires token authentication (Bearer Authentication).

The web interface is built with an option to update its state using web sockets from several resources like main API 
resource and specific bot as well.
The users can manage their accounts and subscriptions, run and manage bots, edit their profiles.
Depending on the authenticated user’s role, the application enables access to admin’s tools, which help to manage users,
 bots, subscriptions and open some features related only to the admin’s scope.


## How to setup?

- Clone repo
- `npm i -g yarn`
- `yarn`
- `cp .env.example .env`

You can find node and npm/yarn versions in `package.json`

## How to run application?

1. Development: 
    - `yarn dev`
2. Production:
    - `yarn build`
    - `yarn start`
    
### Available input types at the moment
- Text input: `string`* or `text` type**<br/><br/>
![Text](public/images/misc/text.png)<br/><br/>
- Password input: `password`<br/><br/>
![Password](public/images/misc/password.png)<br/><br/>
- Small range slider: `range`. Use `range` string field to provide range, like `'1-9'`<br/><br/>
![Slider](public/images/misc/slider.png)<br/><br/>
- Large range input: `number` or `integer`. Use `range` string field to provide range, like `'0-99999'`<br/><br/>
![Slider](public/images/misc/number.png)<br/><br/>
- Select: `enum`. Use `values` array to provide params for it, like `['val1', 'val2']`<br/><br/>
![Select](public/images/misc/select.png)<br/><br/>
- CheckBox-Button: `boolean`<br/><br/>
![Checkbox-Button](public/images/misc/checkbox-button.png)<br/><br/>
- MultiSelect: `multiselect`<br/><br/>
![Checkbox-Button](public/images/misc/multiselect.png)<br/><br/>

<sup>* - types are `case sensitive`!</sup><br/>
<sup>** - which type to use at bot script `PARAMS` section</sup>

The components, described above, are just a small example from the complete basic components list. All the core 
components are located in the `components/default` folder. 
The application is built using the components from the `components` directory.

The codebase is organized according to the Next.js framework file structure. The pages use React components, 
built by using Styled Components. Therefore, the styles are described inside the components.

The main application storage is based on Redux with the usage of saga and thunk middlewares. Basing on such stack, 
the store allows us to manage state depending on HTTP requests results (states as well), makes the code more clear and flexible.

The web sockets are integrated into the store, so it allows us to have a single interface for managing the app’s 
state without odd description or rules switching depending on data resources.

Env file configuration:

`API_URL` - Base API host URL

`SOCKET_URL` - Base Socket host URL

`STRIPE_PUBLIC_KEY` - Stripe client public key for the Stripe checkout functionality

`SENTRY_DSN` - Sentry DSN for tracking and monitoring the errors

TODOs:
- Interact with the offline bots using API
- Connect to the single Socket.io server instead of connecting to the bots separately.
- Merging the data from API and Sockets in the single data nodes
- Re-factor the interface structure according to the provided MockUps
- Features integration
