
const form = document.getElementById("registrationForm");
const successMessage = document.getElementById("successMessage");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

// Get a field's error message element.
function getErrorMessage(field) {
    return field.closest(".form-group").querySelector(".error-message");
}

// Display an error and highlight the invalid field.
function showError(field, message) {
    field.classList.add("error");
    getErrorMessage(field).textContent = message;
}

// Remove an error when the field is corrected.
function clearError(field) {
    field.classList.remove("error");
    getErrorMessage(field).textContent = "";
}

// Remove all validation errors.
function clearAllErrors() {
    form.querySelectorAll(".error").forEach(function (field) {
        field.classList.remove("error");
    });

    form.querySelectorAll(".error-message").forEach(function (message) {
        message.textContent = "";
    });
}

// Validate one field.
function validateField(field) {
    const value = field.value.trim();
    const label = field.dataset.label;

    // Remove unnecessary spaces from text inputs.
    if (field.type !== "date") {
        field.value = value;
    }

    if (field.id === "agreement") {
        if (!field.checked) {
            showError(field, "You must agree before registering.");
            return false;
        }
    } else if (field.id === "birthDate") {
        if (value === "") {
            showError(field, "Please enter your date of birth.");
            return false;
        }

        if (value > new Date().toISOString().split("T")[0]) {
            showError(field, "Date of birth cannot be in the future.");
            return false;
        }
    } else if (value === "") {
        showError(field, label + " is required.");
        return false;
    } else if (field.id === "studentId") {
        if (value.length < 3) {
            showError(field, "Student ID must contain at least 3 characters.");
            return false;
        }
    } else if (field.id === "fullName") {
        if (value.length < 2) {
            showError(field, "Please enter your full name.");
            return false;
        }
    } else if (field.id === "email") {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(value)) {
            showError(field, "Please enter a valid email address.");
            return false;
        }
    } else if (field.id === "phone") {
        // Accept 09XXXXXXXXX or +639XXXXXXXXX.
        const phonePattern = /^(09\d{9}|\+639\d{9})$/;

        if (!phonePattern.test(value)) {
            showError(field, "Use 09123456789 or +639123456789.");
            return false;
        }
    } else if (field.id === "password") {
        if (value.length < 8) {
            showError(field, "Password must be at least 8 characters.");
            return false;
        }
    } else if (field.id === "confirmPassword") {
        if (value !== password.value) {
            showError(field, "Passwords do not match.");
            return false;
        }
    } else if (field.id === "address") {
        if (value.length < 5) {
            showError(field, "Please enter your complete address.");
            return false;
        }
    } else if (field.id === "program" || field.id === "yearLevel") {
        if (value === "") {
            showError(field, "Please select your " + label.toLowerCase() + ".");
            return false;
        }
    }

    clearError(field);
    return true;
}

// Handle form submission.
form.addEventListener("submit", function (event) {
    event.preventDefault();

    successMessage.textContent = "";

    let isValid = true;

    // Validate all ordinary fields.
    const fields = form.querySelectorAll(
        "input:not([type='radio']):not([type='checkbox']), select, textarea"
    );

    fields.forEach(function (field) {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    // Validate gender selection.
    const gender = form.querySelector("input[name='gender']:checked");
    const genderGroup = form.querySelector(".radio-group");
    const genderError = genderGroup
        .closest(".form-group")
        .querySelector(".error-message");

    if (!gender) {
        genderGroup.classList.add("error");
        genderError.textContent = "Please select your gender.";
        isValid = false;
    } else {
        genderGroup.classList.remove("error");
        genderError.textContent = "";
    }

    // Stop if any field is invalid.
    if (!isValid) {
        const firstError = form.querySelector(".error");
        if (firstError) {
            firstError.focus();
        }
        return;
    }

    // Clear errors and display success.
    clearAllErrors();
    successMessage.textContent =
        "Registration successful! Your information has been validated.";
});

// Remove errors as the user corrects information.
form.querySelectorAll("input, select, textarea").forEach(function (field) {
    field.addEventListener("input", function () {
        if (field.id === "agreement" || field.type === "radio") {
            return;
        }

        validateField(field);
    });

    field.addEventListener("change", function () {
        if (field.id === "agreement") {
            validateField(field);
        }

        if (field.type === "radio") {
            const genderGroup = form.querySelector(".radio-group");
            genderGroup.classList.remove("error");
            genderGroup.closest(".form-group")
                .querySelector(".error-message").textContent = "";
        }
    });
});

// Show or hide passwords.
form.querySelectorAll(".toggle-password").forEach(function (button) {
    button.addEventListener("click", function (event) {
        const targetId = event.currentTarget.dataset.target;
        const target = document.getElementById(targetId);
        const isHidden = target.type === "password";

        // Dynamically change the input's type attribute.
        target.setAttribute("type", isHidden ? "text" : "password");

        // Toggle the button's visual appearance.
        button.classList.toggle("active", isHidden);
        button.textContent = isHidden ? "Hide" : "Show";
        button.setAttribute("aria-pressed", String(isHidden));
    });
});

// Reset fields, errors, and success message.
form.addEventListener("reset", function () {
    clearAllErrors();
    successMessage.textContent = "";

    form.querySelectorAll(".toggle-password").forEach(function (button) {
        const target = document.getElementById(button.dataset.target);

        target.setAttribute("type", "password");
        button.classList.remove("active");
        button.textContent = "Show";
        button.setAttribute("aria-pressed", "false");
    });

    const genderGroup = form.querySelector(".radio-group");
    genderGroup.classList.remove("error");
});