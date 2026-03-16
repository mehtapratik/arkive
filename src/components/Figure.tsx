import styles from "./Figure.module.css";
export function Figure ( { children }: { children: React.ReactNode; } ) {
   return (
      <span className={styles.figure}>
         <i className="ph-light ph-user-circle" aria-hidden="true"></i>
         {children}
      </span>
   )
}
