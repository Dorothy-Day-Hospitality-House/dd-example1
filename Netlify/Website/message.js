

// This class implements the message bar at the top of the window.
// Construct it using the DOM element of the bar.

class MessageBar {

    constructor(e) {
        this.elem = e;
    }

    // Show a message on the bar.  
    // duration (in seconds) default 10 seconds
    // severity 0=info, 1=warning, 2+ = error
    show(message, duration=10, severity=0) {
        this.elem.innerHTML = message;
        this.setColor(severity);
        setTimeout(()=> this.clear(), duration*1000);
    }

    error(message) {  this.show(message,severity=2);  }

    warning(message) {  this.show(message,severity=1);  }

    clear() {
        this.elem.innerHTML = '';
        this.setColor(0);
    }

    setColor(severity) {
        this.elem.classList.toggle('warning', severity==1);
        this.elem.classList.toggle('error', severity>1);
    }
}