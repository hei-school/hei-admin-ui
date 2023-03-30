
const Counter = ({from, to}) => {
    const consecutiveNumbers = [...Array(to-from).keys()].map(i => i + from);
    return <div>{consecutiveNumbers.map(n => <p key={n}>{n}</p>)}</div>
  };
  
  export default Counter;