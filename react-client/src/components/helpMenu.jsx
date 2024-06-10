import React from "react";

const styles = {
    modal: {
      display: 'block',
      position: 'fixed',
      zIndex: 1,
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      overflow: 'auto',
      backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContent: {
      backgroundColor: '#fefefe',
      margin: '15% auto',
      padding: '20px',
      border: '1px solid #888',
      width: '40%',
    },
    close: {
      color: '#aaa',
      float: 'right',
      fontSize: '28px',
      fontWeight: 'bold',
    },
  };

const Modal = ({onClose}) => {
    return (
        <div style={styles.modal}>
        <div style={styles.modalContent}>
            <span style={styles.close} onClick={onClose}>X</span>
            <h2>Information on Controls</h2>
            <h4>W - Forward</h4>
            <h4>S - Backward</h4>
            <h4>A - Left</h4>
            <h4>D - Right</h4>
            <h4>Space bar - Up</h4>
            <h4>Shift Key - Down</h4>
            <h4>Mouse - Control camera</h4>
        </div>
        </div>
    );
}

export default Modal;