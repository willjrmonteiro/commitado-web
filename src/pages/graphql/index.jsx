import React, { useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { BiTrash, BiSave, BiEdit, BiCalendarExclamation, BiCalendarCheck, BiCalendarX } from "react-icons/bi";
import { FaCalendarCheck } from "react-icons/fa";
import Loading from "../../components/util/Loading";
import Query from "../../components/graphql/query";

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
    const [amount, setAmount] = useState("");

    const { loading, error, data } = useQuery(BILLS_QUERY, { client });
    const [createBill] = useMutation(ADD_BILL, { client });
    const [updateBill] = useMutation(EDIT_BILL, { client });
    const [deleteBill] = useMutation(DELETE_BILL, { client });
    const [rendering, setRendering] = useState(false);

    if (loading) return <Loading />;
    if (error) return <p>Error :{error.message}</p>;

    const handleCreateBill = (e) => {
        
        e.preventDefault();

        setRendering(true);
        
        const statusDefault = deadline > new Date().toISOString().slice(0,10) ? "PENDING" : "LATE";

        createBill({
            variables: {
                input: {
                    name,
                    deadline,
                    status: statusDefault,
                    amount
                }
            },
            refetchQueries: [{ query: BILLS_QUERY }]
        });

        resetState();
        setRendering(false);
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
        setRendering(true);

        if(window.confirm("Deseja limpar o formulário?")){
            resetState();
            setRendering(false);           
        }else{
            setRendering(false);
            return;
        }        
        
    }

    const resetState = () =>{
        
        setId("");
        setName("");
        setDeadline("");
        setStatus("");
        setAmount("");
    }

    const handleUpdateBill = (e) => {

        e.preventDefault();
        setRendering(true);
        
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

        resetState();
        setRendering(false);
    }

    const handleDeleteBill = (id) => {

        if(!window.confirm("Deseja realmente exluir esta conta?"))
            return;

        setRendering(true);
        
        deleteBill({
            variables: {
                id
            },
            refetchQueries: [{ query: BILLS_QUERY }]
        });

        setRendering(false);        
    }

    const handleUpdateStatus = (bill) => {

        if(!window.confirm("Deseja confirmar o pagamento desta conta?"))
            return;

        setRendering(true);
        handlePreUpdateBill(bill);
        
        updateBill({
            variables: {
                id,
                input: {
                    name,
                    deadline,
                    status: "PAID",
                    amount
                }
            },
            refetchQueries: [{ query: BILLS_QUERY }],
            onCompleted: () => {
                resetState();
            }
        });

        setRendering(false);
    }   

    const handleSubmit = (e) => {
        e.preventDefault();
        id === "" ? handleCreateBill(e) : handleUpdateBill(e);

    }

    const handleShowStatus = (status) => {
        switch (status) {
            case "PENDING":
                return <BiCalendarExclamation className="icon yellow" />
            case "PAID":
                return <BiCalendarCheck className="icon green" />
            case "LATE":
                return <BiCalendarX className="icon red" />
            default:
                return <BiCalendarExclamation className="icon" />
        }
    }

    return (
            <div className="container">     
                {rendering && <Loading />}         
                <div className="header">
                <FaCalendarCheck className="logo" />
                    <span className="title">
                        Commitado
                    </span>         
                </div>
                <form className="form" onSubmit={handleSubmit}>
                    <input type="hidden" id="id" name="id" value={id} />
                    <div className="wrap-input">
                        <input 
                            className={name !== "" ? "has-val input" : "input"}
                            type="text" 
                            id="name" 
                            name="name" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required 
                        />
                    <span className="focus-input" data-placeholder="Nome"></span>
                    </div>
                    <div className="wrap-input">
                    <input
                        className={amount !== "" ? "has-val input" : "input"}
                        type="number" 
                        id="amount" 
                        name="amount" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required 
                    />
                    <span className="focus-input" data-placeholder="Valor"></span>
                    </div>
                    <div className="wrap-input">
                <input 
                    className={"has-val input"}
                    type="date" 
                    id="deadline"
                    name="deadline"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    required
                />
                <span className="focus-input" data-placeholder="Vencimento"></span>
                </div>
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
                    <Query error={error} loading={loading} data={data}>
                    {data.bills.map((bill) => (
                        <tr key={bill.id}>
                            <td>{bill.name}</td>
                            <td>{bill.amount}</td>
                            <td>{bill.deadline}</td>
                            <td><span className="action-icon"
                            onClick={(e) => handleUpdateStatus(bill)}
                            >{handleShowStatus(bill.status)}</span></td> 
                            <td>
                            <span 
                                className="action-icon"
                                value={bill.id}                            
                                onClick={ (e) => handlePreUpdateBill(bill)}
                            >
                                <BiEdit />
                            </span>
                            </td>               
                            <td>
                            <span
                                className="action-icon"
                                value={bill.id}                            
                                onClick={ (e) => handleDeleteBill(bill.id)}
                            >
                                <BiTrash />
                            </span>
                            </td>
                    </tr>
                    ))}
                    </Query>
                </tbody>
            </table>
        </div>
    );
}



