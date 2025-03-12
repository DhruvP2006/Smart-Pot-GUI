import Button from "../Button/Button";
import chartIcon from "./../../assets/chart.png";
import moistureIcon from "./../../assets/drop.png";
import styles from "./Box.module.css";
import "./Box.module.css";

const Box = () => {
  return (
    <div className={styles.box}>
      <div className={styles.boxIcon}>
        <img src={moistureIcon} alt="" className={styles.boxIconImg} />
      </div>
      <h1>21</h1>
      <Button icon={chartIcon} />
    </div>
  );
};

export default Box;
