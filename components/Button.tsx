import { IconType } from 'react-icons';

type Props = {
  id?: string; // 'id' is optional, as not all buttons might need one
  title: string;
  leftIcon?: IconType; // 'leftIcon' is optional and expected to be a React Icon component
  rightIcon?: IconType; // 'rightIcon' is optional and expected to be a React Icon component
  containerClass?: string; // 'containerClass' is optional for styling
};

const Button = ({
  id,
  title,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  containerClass,
}: Props) => {
  return (
    <button
      id={id}
      className={`group relative z-10 w-fit cursor-pointer overflow-hidden rounded-full
     bg-violet-50 px-7 py-3 text-black ${containerClass}`}
    >
      {LeftIcon && <LeftIcon />} 
      <span className='relative incline-flex overflow-hidden font-general text-xs uppercase'>
        <div>{title}</div>
      </span>
      {RightIcon && <RightIcon />}
    </button>
  );
};

export default Button;
