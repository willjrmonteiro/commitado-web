import React, { useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { BiTrash, BiSave, BiEdit, BiCalendarExclamation, BiCalendarCheck, BiCalendarX } from "react-icons/bi";


const client = new ApolloClient({
    uri: "http://localhost:8080/query",
    cache: new InMemoryCache()
  });
  

const BILLS_QUERY = gql`   
    {
        bills {
            id
            name
            deadline
            status
            amount
        }
    }
`;

const VIEW_BILL = gql`
  query ($id: Int){
    bill(id: $id) {
        id,
        name,
        deadline,
        status,
        amount
    }
  }
`;

const ADD_BILL = gql`
  mutation createBill($input: CreateBillInput!){
    createBill(input: $input){
        name
    }
}
`;

const EDIT_BILL = gql`
    mutation updateBill(
      $id: ID!
      $input: UpdateBillInput!){
        updateBill(id: $id, input: $input){
            name
        }
  }
`;

const DELETE_BILL = gql`
  mutation ($id: ID!){
  deleteBill(id: $id){
    deletedBillId
  }
}
`

export const GetBills = () => {
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [deadline, setDeadline] = useState("");
    const [status, setStatus] = useState("");
    const [amount, setAmount] = useState(null);

    const { loading, error, data } = useQuery(BILLS_QUERY, { client });
    const [createBill] = useMutation(ADD_BILL, { client });
    const [updateBill] = useMutation(EDIT_BILL, { client });
    const [deleteBill] = useMutation(DELETE_BILL, { client });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    const handleCreateBill = (e) => {
        e.preventDefault();
        
        createBill({
            variables: {
                input: {
                    name,
                    deadline,
                    status,
                    amount
                }
            },
            refetchQueries: [{ query: BILLS_QUERY }]
        });
    }

    const handlePreUpdateBill = (bill) => {

        setId(bill.id);
        setName(bill.name);
        setDeadline(bill.deadline);
        setStatus(bill.status);
        setAmount(bill.amount);

    }

    const handleClearForm = (e) => {
        
        e.preventDefault();

        setId("");
        setName("");
        setDeadline("");
        setStatus("");
        setAmount(0);
    }



    const handleUpdateBill = (e) => {

        e.preventDefault();
        
        updateBill({
            variables: {
                id,
                input: {
                    name,
                    deadline,
                    status,
                    amount
                }
            },
            refetchQueries: [{ query: BILLS_QUERY }]
        });
    }

    const handleDeleteBill = (id) => {
        alert(id);
        deleteBill({
            variables: {
                id
            },
            refetchQueries: [{ query: BILLS_QUERY }]
        });
    }

    const handleViewBill = (e) => {
        e.preventDefault();
        setId(e.target.value);
        alert(id);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        id === "" ? handleCreateBill(e) : handleUpdateBill(e);

    }

    const handleShowStatus = (status) => {
        switch (status) {
            case "PENDING":
                return <BiCalendarExclamation className="action-icon" />
            case "PAID":
                return <BiCalendarCheck className="action-icon" />
            case "LATE":
                return <BiCalendarX className="action-icon" />
            default:
                return <BiCalendarExclamation className="action-icon" />
        }
    }

    return (
                <div className="container">
                <span className="title">
                    <h1>Bills List</h1>
                </span>
                <form className="form" onSubmit={handleSubmit}>
                    <label for="name">Name:</label>
                    <input type="hidden" id="id" name="id" value={id} />
                    <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required 
                    />
                    <label for="amount">Amount:</label>
                    <input 
                        type="number" 
                        id="amount" 
                        name="amount" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required 
                    />
                <label for="due-date">Due Date:</label>
                <input 
                    type="date" 
                    id="deadline"
                    name="deadline"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    required
                />
                <label for="status">Status:</label>
                <select 
                    id="status"
                    name="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                >
                    <option value="PENDING">PENDING</option>
                    <option value="PAID">PAID</option>
                    <option value="LATE">LATE</option>
                </select>
                <div className="actions">
                    <button
                        className="clear"
                        onClick={handleClearForm}
                    >
                        <span className="btn-icon">
                        <BiTrash />
                        </span>
                        <span>Limpar</span>
                    </button>
                    <button className="save">
                        <span className="btn-icon">
                            <BiSave />
                        </span>
                        <span>Salvar</span>
                    </button> 
                </div>
            </form>
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {data.bills.map((bill) => (
                        <tr key={bill.id}>
                            <td>{bill.name}</td>
                            <td>{bill.amount}</td>
                            <td>{bill.deadline}</td>
                            <td><span className="action-icon">{handleShowStatus(bill.status)}</span></td> 
                            <td>
                            <span className="action-icon">
                            <BiEdit
                                className="action-icon"
                                value={bill.id}                            
                                onClick={ (e) => handlePreUpdateBill(bill)}
                                />
                                </span>
                            </td>               
                            <td>
                            <span className="action-icon">
                                <BiTrash
                                    className="action-icon"
                                    value={bill.id}                            
                                    onClick={ (e) => handleDeleteBill(bill.id)}
                                />
                                </span>
                            </td>
                        
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}



