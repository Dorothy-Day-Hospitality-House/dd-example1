

// This class implements the message bar at the top of the window.
// Construct it using the DOM element of the bar.

class MessageBar {

    constructor(e) {
        this.elem = e;
        this.tm = 0;
    }

    // Show a message on the bar.  
    // duration (in seconds) default 10 seconds
    // severity 0=info, 1=warning, 2+ = error
    show(message, duration=10, severity=0) {
        let uniq = Date.now();
        this.tm = uniq;
        this.elem.innerHTML = message;
        this.setColor(severity);
        setTimeout(()=> this.clear(uniq), duration*1000);
    }

    error(message) {  this.show(message,10,2);  }

    warning(message) {  this.show(message,10,1);  }

    // Clear the message.  You can pass in a unique message id, and it will only
    // clear if the most recent message id matches the uniq.
    clear(uniq = 0) {
        if (uniq && uniq != this.tm) return;
        this.elem.innerHTML = '';
        this.setColor(0);
    }

    setColor(severity) {
        this.elem.classList.toggle('warning', severity==1);
        this.elem.classList.toggle('error', severity>1);
    }
}