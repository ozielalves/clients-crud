import React, { FormEvent, useEffect, useState } from "react";
/* import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography"; */
import Layout from "./Layout";

import * as client from "../db/repositories/clients";
import { Container, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
  centerItem: {
    height: 240,
    /* padding: "49px 75px", */
    display: "flex",
    alignItems: "center",
    paddingTop: "60px",
  }
}));

export default function BiForm() {
  const classes = useStyles();

  // some needed states
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clients, setClients] = useState<Array<client.Client>>([]);
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [debt, setDebt] = useState(0);
  const [credit, setCredit] = useState(0);
  const [selectedId, setSelectedId] = useState("");

  // fetch all clients when this view mounted
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    // clean the clients array first
    setClients([]);

    // fetch clients from repository
    const _clients = await client.all();

    // set clients to state
    setClients(_clients);
  };

  const onSubmit = async (e: FormEvent) => {
    // prevent form reload the page
    e.preventDefault();

    // disable the form input and button
    setIsSubmitting(true);

    // repository function to call is depend on isEditMode state
    if (!isEditMode)
      await client.create({
        company: company,
        firstname: firstname,
        lastname: lastname,
        email: email,
        debt: debt,
        credit: credit,
      });
    else
      await client.update(selectedId, {
        company: company,
        firstname: firstname,
        lastname: lastname,
        email: email,
        debt: debt,
        credit: credit,
      });

    // clean the form
    setCompany("");
    setEmail("");
    setLastname("");
    setFirstname("");
    setDebt(0);
    setCredit(0);
    setIsSubmitting(false);
    setIsEditMode(false);
    fetchClients();
  };

  const remove = async (id: string) => {
    // clean the clients state to prevent user double clicking the delete / edit button
    setClients([]);

    // remove client
    await client.remove(id);

    // fetch again the clients
    fetchClients();
  };

  const toEditMode = (
    id: string,
    company: string,
    email: string,
    firstname: string,
    lastname: string,
    credit: number,
    debt: number
  ) => {
    // set editmode state
    setIsEditMode(true);

    // need to tweak the date first before put it in input datetime local
    /* const _date =
            new Date(date.toDate()).getFullYear() +
            "-" +
            (new Date(date.toDate()).getMonth() + 1) +
            "-" +
            (new Date(date.toDate()).getDate().toString().length === 1 ? "0" + new Date(date.toDate()).getDate() : new Date(date.toDate()).getDate());

        const time =
            new Date(date.toDate()).toLocaleTimeString().replaceAll("AM", "").replaceAll("PM", "").replace(/\s/g, "").length === 7
                ? "0" + new Date(date.toDate()).toLocaleTimeString().replaceAll("AM", "").replaceAll("PM", "").replace(/\s/g, "")
                : new Date(date.toDate()).toLocaleTimeString().replaceAll("AM", "").replaceAll("PM", "").replace(/\s/g, "");

        const dateString = (_date + "T" + time).toString(); */

    // set the form value
    setCompany(company);
    setEmail(email);
    setFirstname(firstname);
    setLastname(lastname);
    setDebt(0);
    setCredit(0);

    setSelectedId(id);
  };

  return (
    <div className={classes.root}/* "app" */>
      <Layout />
      <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Container maxWidth="lg" className={classes.container}>
          {/* form for create or update the value */}
          <form onSubmit={onSubmit}>
            <label>First Name</label>

            <input
              type="text"
              placeholder="Ex: Renata"
              required
              disabled={isSubmitting}
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
            <label>Last Name</label>

            <input
              type="text"
              placeholder="Ex: Silva"
              required
              disabled={isSubmitting}
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
            <label>Email</label>

            <input
              type="text"
              placeholder="Ex: exemple@exemple.com"
              required
              disabled={isSubmitting}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Company</label>

            <input
              type="text"
              placeholder="Ex: Writing medium story"
              required
              disabled={isSubmitting}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            <label>Credit</label>

            <input
              type="text"
              placeholder="Ex: Writing medium story"
              required
              disabled={isSubmitting}
              value={credit}
              onChange={(e) => setCredit(Number(e.target.value))}
            />
            <label>Debt</label>

            <input
              type="text"
              placeholder="Ex: Writing medium story"
              required
              disabled={isSubmitting}
              value={debt}
              onChange={(e) => setDebt(Number(e.target.value))}
            />

            {/* change the button value depends on isEditMode state  */}
            <button
              type="submit"
              style={{
                marginTop: "12px",
                backgroundColor: isEditMode ? "#eb9834" : "#44c922",
              }}
              disabled={isSubmitting}
            >
              {isEditMode ? "Edit" : "Add"}
            </button>
          </form>

          <h2>Clients:</h2>

          {/* show if clients is empty */}
          {clients.length === 0 ? (
            <div className="loading">
              <span>Fetching Clients ...</span>
            </div>
          ) : null}

          {/* clients item  */}
          {clients.map((client, index) => (
            <div
              className="list-item"
              key={client.id}
              style={{ marginTop: index > 0 ? "12px" : "" }}
            >
              <span className="company">{client.firstname}</span>
              <span className="company">{client.lastname}</span>
              <span className="company">{client.email}</span>
              <span className="company">{client.company}</span>
              <span className="company">{client.credit}</span>
              <span className="company">{client.debt}</span>

              <span
                className="edit"
                onClick={() =>
                  toEditMode(
                    client.id!!,
                    client.company,
                    client.email,
                    client.firstname,
                    client.lastname,
                    client.credit,
                    client.debt
                  )
                }
              >
                Edit
              </span>

              <span className="delete" onClick={() => remove(client.id!!)}>
                Delete
              </span>
            </div>
          ))}
        </Container>
      </main>
    </div>
  );
}
/* 
BiForm.propTypes = {
  children: PropTypes.node,
}; */
