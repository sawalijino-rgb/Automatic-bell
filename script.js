/*
====================================================
ESP32 ADDRESS
====================================================

After uploading the ESP32 code, Serial Monitor
will show something like:

ESP32 IP Address: 192.168.1.105

Change the address below to that IP.
*/

const ESP32_IP = "192.168.1.100";


/*
====================================================
SEND COMMAND
====================================================
*/

async function sendCommand(path) {

    try {

        const response = await fetch(
            "http://" + ESP32_IP + path,
            {
                method: "GET",
                cache: "no-store"
            }
        );

        if (!response.ok) {
            throw new Error("ESP32 returned an error");
        }

        const result = await response.text();

        console.log(result);

        updateStatus();

    } catch (error) {

        console.error(error);

        setOffline();
    }
}


/*
====================================================
ALL 5 BELLS
====================================================
*/

function bell() {

    sendCommand("/bell");
}


/*
====================================================
STOP
====================================================
*/

function stopBell() {

    sendCommand("/stop");
}


/*
====================================================
INDIVIDUAL BELL
====================================================
*/

function bellNumber(number) {

    if (number < 1 || number > 5) {
        return;
    }

    sendCommand("/bell" + number);
}


/*
====================================================
EARTHQUAKE
====================================================
*/

function earthquake() {

    const confirmAlarm =
        confirm(
            "Start EARTHQUAKE ALARM?"
        );

    if (confirmAlarm) {

        sendCommand("/earthquake");
    }
}


/*
====================================================
FIRE
====================================================
*/

function fireAlarm() {

    const confirmAlarm =
        confirm(
            "Start FIRE ALARM?"
        );

    if (confirmAlarm) {

        sendCommand("/fire");
    }
}


/*
====================================================
STOP EMERGENCY
====================================================
*/

function stopAlarm() {

    sendCommand("/stopalarm");
}


/*
====================================================
OFFLINE
====================================================
*/

function setOffline() {

    const connection =
        document.getElementById(
            "connection"
        );

    connection.textContent =
        "ESP32 DISCONNECTED";

    connection.className =
        "status offline";
}


/*
====================================================
UPDATE STATUS
====================================================
*/

async function updateStatus() {

    try {

        const response = await fetch(
            "http://" +
            ESP32_IP +
            "/status?time=" +
            Date.now(),
            {
                method: "GET",
                cache: "no-store"
            }
        );

        if (!response.ok) {
            throw new Error("Status unavailable");
        }

        const data =
            await response.json();


        /*
        Connection
        */

        const connection =
            document.getElementById(
                "connection"
            );

        connection.textContent =
            "ESP32 CONNECTED";

        connection.className =
            "status online";


        /*
        System status
        */

        document.getElementById(
            "systemStatus"
        ).textContent =
            data.status;


        /*
        Current subject
        */

        document.getElementById(
            "currentSubject"
        ).textContent =
            data.subject;


        /*
        Remaining time
        */

        document.getElementById(
            "remaining"
        ).textContent =
            data.remaining;


        /*
        Active subject
        */

        updateActiveSubject(
            data.current
        );

    } catch (error) {

        console.error(error);

        setOffline();
    }
}


/*
====================================================
ACTIVE SUBJECT
====================================================
*/

function updateActiveSubject(current) {

    const subjects =
        document.querySelectorAll(
            ".subject"
        );

    subjects.forEach(
        (item, index) => {

            if (index === current) {

                item.classList.add(
                    "active"
                );

            } else {

                item.classList.remove(
                    "active"
                );
            }
        }
    );
}


/*
====================================================
CHECK STATUS EVERY SECOND
====================================================
*/

setInterval(
    updateStatus,
    1000
);


/*
====================================================
INITIAL CHECK
====================================================
*/

updateStatus();
```
