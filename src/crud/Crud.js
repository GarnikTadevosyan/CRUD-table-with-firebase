import React, { useEffect, useState } from 'react';

import { db } from './services/firebaseConfig';
import { collection, getDocs, deleteDoc, doc, setDoc } from 'firebase/firestore';

import { Formik, Form } from 'formik';
import { validationSchema } from './validation/validation';

import TextField from './components/textField/TextField';
import Modal from './components/modal/Modal';

export let repetitiveEmail = '';

function Crud() {
  const [users, setUsers] = useState([]);
  const [initialValues, setInitialValues] = useState({name:'',email:''});
  const [isEditing, setIsEditing] = useState(false);
  const [editableUserId, setEditableUserId] = useState('');
  const [editableUserData, setEditableUserData ] = useState({name:'',email:''});
  const [deleteUserId, setDeleteUserId] = useState('');
  const [showModal, setShowModal] = useState({isShow:false,text:''});
 
  const usersCollectionHref = collection(db, 'users');

  useEffect(() => {
    async function getUsers() {
      try {
        const data = await getDocs(usersCollectionHref);
        const userData = data.docs.map((doc) => doc.data());
        setUsers([...userData]);
      } catch(error) {
          throw error
      }
    }
    getUsers();
  }, []);
  
  async function deleteUser(id) {
    setShowModal({isShow:true,text:'Do you Want to delete This User ?'});
    setDeleteUserId(id);
    onReset();
  }

  async function addUser(user) {
    const newUserHref = doc(usersCollectionHref);
    const newUser = { ...user, id: newUserHref.id };
    try {
      await setDoc(newUserHref, newUser)
      setUsers([...users,newUser])
      onReset();
    }
    catch(error) {
      throw error
    }
  }  
 
  function editUser(id, editableUser) {
    setIsEditing(true)
    setEditableUserId(id);
    setEditableUserData({name:editableUser.name,email:editableUser.email});
  }
   
  const onSubmit = async (values) => {
    console.log(values);
    if (isEditing) {
      const updateUser = {id:editableUserId,...editableUserData}
      try {
        await setDoc(doc(usersCollectionHref,editableUserId),updateUser);
        const copyUsers = [...users];
        const index = copyUsers.findIndex( user => user.id === updateUser.id);
        copyUsers[index] = updateUser
        setUsers(copyUsers);
        onReset();
      } catch(error) {
          throw error
      }
    } else {
        addUser(values);
    } 
  }
  
  const onReset = () => {
    if(!isEditing) {
      setInitialValues({name:'',email:''})
    } else {
      setEditableUserData({name:'',email:''});
      setIsEditing(false);
      repetitiveEmail = ''
    }
  }
  
  function handelChange (event) {
    if(event.target.name === 'name' && !isEditing) {
      setInitialValues({name:event.target.value,email:initialValues.email})
    }
    if(event.target.name === 'email' && !isEditing) {
      setInitialValues({name:initialValues.name,email:event.target.value})
      const index = users.findIndex( user => user.email === event.target.value);
       if (index !== -1) {
         repetitiveEmail = event.target.value
       } else {
        repetitiveEmail = ''
       }
    }
    if(event.target.name === 'name' && isEditing) {
      setEditableUserData({name:event.target.value,email:editableUserData.email})
    }
    if(event.target.name === 'email' && isEditing) {
      setEditableUserData({name:editableUserData.name,email:event.target.value})
    }  
  }

  async function ModalActions(deleting) {
           if(deleting) {
             try {
               await deleteDoc(doc(usersCollectionHref, deleteUserId));
               setUsers([...users].filter( user => user.id !== deleteUserId));
             } catch(error) {
                 throw error 
             }
           }
           setShowModal({isShow:false,text:''})
  }

  return (
    <div className='crud_box'>
      { showModal.isShow ?  <Modal text={showModal.text} modalActions={ModalActions} /> : null }
      <div className="crud_table">
        <table>
          <thead>
            <tr>
              <th>№</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user,index) => {
              return (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <div className='table_btn_container'>
                      <button
                        className='edit' 
                        onClick={() => editUser(user.id, user)}>Edit</button>
                      <button
                        className='delete' 
                        onClick={() => deleteUser(user.id)}>Delete</button>
                    </div>
                  </td>
                </tr>)
            })}
          </tbody>
        </table>
      </div>
      <div className='crud_form'>
        <div className='form_box'>
          <Formik
            enableReinitialize={true}
            initialValues={!isEditing ? initialValues : editableUserData}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
            validateOnChange={false}
            validateOnBlur={true}
          >
            {(FormikProps) => {
              return (
              <Form>
                <TextField 
                 name="name" 
                 type="text" 
                 label="Name"
                 handelChange={handelChange}
                 placeholder='type your name'
                />
                <TextField 
                 name="email" 
                 type="email" 
                 label="Email"
                 handelChange={handelChange}
                 placeholder='type your email'
                />
                <div className='form_btn_container'>
                   <button
                     onClick={ () => onReset() }
                     type='reset'
                     className='reset'>
                     Clean
                   </button>
                   <button 
                     type="submit" 
                     className={ !isEditing ? 'submit' : 'edit' }
                     disabled={!FormikProps.isValid || !FormikProps.values.email || !FormikProps.values.name || repetitiveEmail}>
                     { !isEditing ? 'Submit' : 'Edit' }
                   </button>
                 </div>
              </Form>
            )}}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default Crud;

