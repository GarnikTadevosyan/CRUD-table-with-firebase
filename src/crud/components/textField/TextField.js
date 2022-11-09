import { useField } from 'formik';
import { repetitiveEmail } from '../../Crud';

function TextField ({ label,handelChange,placeholder,...props }) {
    
    const [field, meta, helpers] = useField(props.name);
    
    return (
      <>
        <label>
          {label}
        </label>
        <br/>
        <input 
          {...field} 
          {...props} 
          onChange={ (event) => handelChange(event)}
          placeholder={placeholder}/>
        <br/>
        {meta.error ? (
          <div className="error">{meta.error}</div>
        ) : null}
        {repetitiveEmail && field.name === 'email' ? (
          <div className="email_repeat_error">This email include in table</div>
        ) : null}
      </>
    );
  };

export default TextField;
  