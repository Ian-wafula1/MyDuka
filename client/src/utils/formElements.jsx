import { useField } from 'formik';

const MyTextInput = ({ label, ...props }) => {
	const [field, meta] = useField(props);
	return (
		<div className='input-box'>
			<input className={"text-input " + (meta.touched ? 'touched': '')} id={props.id || props.name} {...field} {...props} placeholder=' ' />
			<label htmlFor={props.id || props.name}>{label}</label>
			{meta.touched && meta.error ? <div className="error">{meta.error}</div> : null}
		</div>
	);
};

const MyCheckbox = ({ children, ...props }) => {
	const [field, meta] = useField({ ...props, type: 'checkbox' });
	return (
		<div className="input-box">
			<label className="checkbox-input">
				<input type="checkbox" {...field} {...props} />
				{children}
			</label>
			{meta.touched && meta.error ? <div className="error">{meta.error}</div> : null}
		</div>
	);
};

const MySelect = ({ label, ...props }) => {
	const [field, meta] = useField(props);
	return (
		<div>
			<label htmlFor={props.id || props.name}>{label}</label>
			<select {...field} {...props} />
			{meta.touched && meta.error ? <div className="error">{meta.error}</div> : null}
		</div>
	);
};

// similar to mySelect
const MyRadio = ({ label, ...props }) => {
	const [field, meta] = useField(props);
	return (
		<div>
			<label htmlFor={props.id || props.name}>{label}</label>
			<input type="radio" {...field} {...props} />
			{meta.touched && meta.error ? <div className="error">{meta.error}</div> : null}
		</div>
	);
}

export { MyTextInput, MyCheckbox, MySelect, MyRadio };
