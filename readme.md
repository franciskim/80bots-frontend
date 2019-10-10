![80bots front-end](public/images/80bots.svg)

## SaaS front-end part

Next.js application

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
