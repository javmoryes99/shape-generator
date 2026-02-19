import useSelector from "../hooks/useSelector";

function Selector() {
  const { selector, setSelector } = useSelector();

  const onSelectorChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setSelector((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  return (
    <div className="card w-full bg-base-200 card-md shadow-sm">
      <div className="card-body">
        <h2 className="card-title">Shape generator</h2>
        <span>Number of sides</span>
        <input
          name="sides"
          className="input w-full"
          type="number"
          min="2"
          max="20"
          value={selector.sides}
          onChange={onSelectorChange}
        />
        <span>Diameter</span>
        <input
          name="diameter"
          className="input w-full"
          type="number"
          value={selector.diameter}
          onChange={onSelectorChange}
        />
        <span>Shape</span>
        <select
          name="type"
          className="input w-full"
          value={selector.type}
          onChange={onSelectorChange}
        >
          <option value="circle">Circle</option>
          <option value="shape">Shape</option>
        </select>
      </div>
    </div>
  );
}

export default Selector;
