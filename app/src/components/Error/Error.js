import styles from "./Error.module.css";

export function Error ({ errorMsg }) {
    return (
        <div className={styles.errorWrapper}>
            <div className={styles.errorContainer}>
                <div>
                    <h2>Error</h2>
                </div>
                <div>
                    <h3>{errorMsg}</h3>
                </div>
            </div>
        </div>
    )
}