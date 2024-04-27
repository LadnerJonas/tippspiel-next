import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Card} from '@nextui-org/react';

type ToastComponentProps = {
    message: string;
    type: 'success' | 'error';
};

const ToastComponent: React.FC<ToastComponentProps> = ({message, type}) => {
    if (type === 'success') {
        toast.success(message);
    } else if (type === 'error') {
        toast.error(message);
    }
    return null;
};

export default ToastComponent;