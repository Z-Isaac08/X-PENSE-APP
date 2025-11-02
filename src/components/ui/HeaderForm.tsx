type HeaderProps = {
  title: string;
};

const HeaderForm: React.FC<HeaderProps> = ({ title }) => {
  return <h2 className="text-xl font-semibold">{title}</h2>;
};

export default HeaderForm;
