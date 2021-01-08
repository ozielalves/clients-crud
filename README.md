# Green Sales Manager

Green Sales is an app to manage sales! Once on the site, the user is able to register clients with initial credit or initial debt. It is possible to register a sale to an existing customer, the value of which will update debt or credit values in the customer's account.

Green Sales was developed using [React JS](https://pt-br.reactjs.org/) and consumes data from a custom API created using [Firebase](https://firebase.google.com/). Besides React and Firebase, other technologies were employed, such as: [TypeScript](https://www.typescriptlang.org/), [Material UI](https://material-ui.com/), [Recharts](https://recharts.org/en-US/), [Styled Components](https://styled-components.com/) and more.

## Features

### **Dashboard Page with recent sales and analytical data**

<img src="src/assets/dashboard.PNG"/>

The dashboard page presents a plot depicting sales made during the day, that was implemented using the Recharts library.

### **Client Register Page**

<img src="src/assets/clientRegister.PNG"/>

"TextField" input components, from the Material UI library, were used on the client registration page. In addition to form validation, the data also undergoes a content validation before being submitted.

### **Client List Page**

<img src="src/assets/clientsList.PNG"/>

After registering a client, the user is redirected to the clients listing page, in which customers are displayed in a table on alphabtical order. On each item of the table, it is possible to edit or delete an existing client.

### **Client Editing Modal**

<img src="src/assets/clientEdit.PNG"/>

The client editing modal is displayed whenever the user hits a client editing button. The user is allowed to change all of the informations about a customer, except their email.

### **Client Deletion Confirmation Modal**

<img src="src/assets/clientDelete.PNG"/>

The client deletion confirmation modal is displayed whenever the user hits a client deletion button.

### **Sale Registering Page**

<img src="src/assets/saleRegister.PNG"/>

The sale registering page works in the same fashion as the clients one. For each sale, the user is asked to select an associated customer, it's date and time of occurrence, it's total value and to provide a simple description for identification purposes. Upon a sale's registration, the concerned client's credit or debt will be automatically updated.

### **Sales Listing Page**

<img src="src/assets/salesList.PNG"/>

After registering a sale, the user is redirected to the sales listing page, where the sales are displayed on a table in descending order by their date of occurrence. On each item of the table, it is possible to edit or delete an existing sale.

### **Sale Editing Modal**

<img src="src/assets/saleEdit.PNG"/>

The sale editing modal is displayed whenever the user hits a sale editing button. The user is only allowed to change the sale description and its total value.

### **Sale Deletion Confirmation Modal**

<img src="src/assets/saleDelete.PNG"/>

The sale deletion confirmation modal is displayed whenever the user hits a sale deletion button.

**Obs.:** The notification of errors and successes occurs via snackbar

## Requirements

- Node.js LTS release or greater
- Yarn (optional)
- React JS
- Git

## Documentation

- [React JS](https://reactnative.dev/docs/environment-setup)

### Quick running

Assuming [Git](https://git-scm.com/) and [NodeJS LTS](https://nodejs.org/en/) are installed, it is possible to follow:

1. Download the project and go to the root directory

   ```bash
   git clone https://github.com/ozielalves/clients-crud.git && cd client-crud/
   ```

2. On the repository root directory install the required packages

   ```bash
   npm install

   # or

   yarn install
   ```

3. Runnning

   ```bash
   npm start

   # or

   yarn start
   ```

## Building

```bash
   npm run build
```

## TODO

- [ ] Create unit tests;
- [ ] Allow users to signup and login;
- [ ] Reevaluate business rules planning;
- [ ] Single email validation for clients.

## Contributing

You are welcome to contribute! Create the pull requests.

For major changes, please, open an issue first to discuss what you would like to change.

## Support

- [Twitter @ozielvales](https://twitter.com/ozielvales) | [E-mail](mailto:ozielalves@ufrn.edu.br)

## Author

- [Oziel Alves](https://github.com/ozielalves)
