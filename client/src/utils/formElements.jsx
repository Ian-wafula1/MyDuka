import { useField, useFormikContext } from 'formik';
import React from 'react';

const MyTextInput = ({ label, ...props }) => {
	const [field, meta] = useField(props);
	return (
		<div className="input-box">
			<input className={'text-input ' + (meta.touched ? 'touched' : '')} id={props.id || props.name} {...field} {...props} placeholder=" " />
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
};

const MyField = (props) => {
	const {
		values: { textA, textB },
		touched,
		setFieldValue,
	} = useFormikContext();
	const [field, meta] = useField(props);

	React.useEffect(() => {
		if (textA.trim() !== '' && textB.trim() !== '' && touched.textA && touched.textB) {
			setFieldValue(props.name, `textA: ${textA}, textB: ${textB}`);
		}
	}, [textB, textA, touched.textA, touched.textB, setFieldValue, props.name]);

	return (
		<>
			<input {...props} {...field} />
			{!!meta.touched && !!meta.error && <div>{meta.error}</div>}
		</>
	);
};

export { MyTextInput, MyCheckbox, MySelect, MyRadio };
