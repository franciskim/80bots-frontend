const addNotification = (notificationAlertRef, type) => {
    let options = {
        place: "tc",
        message: (
            <div className="alert-text">
            <span className="alert-title" data-notify="title">
                {" "}
                Bootstrap Notify
            </span>
            <span data-notify="message">
                Turning standard Bootstrap alerts into awesome notifications
            </span>
            </div>
        ),
        type: type,
        icon: "ni ni-bell-55",
        autoDismiss: 7,
    };
    notificationAlertRef.current.notificationAlert(options);
}

export {
    addNotification
}