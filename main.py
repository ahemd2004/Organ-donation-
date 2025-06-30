from flask import Flask,Blueprint ,make_response, request, render_template, redirect, url_for, jsonify

# Initialize Flask app
app = Flask(__name__)

# Define main blueprint
main = Blueprint('main', __name__)

@main.route('/')
def home():
    return render_template('home.html')
    
# Donor and Patient data stores
donors = []
patients = []

users = {
    "1@gmail.com": {    
        'user_id': 1,
        'username': "ahmed",
        'email': "1@gmail.com",
        'telephone': 11,
        'country': "yemen",
        'password': "123"
    }
}

@main.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        data = request.get_json() if request.is_json else request.form
        username = data.get('username')
        email = data.get('email')
        telephone = data.get('telephone')
        country = data.get('country')
        birthday = data.get('birthday')
        status = data.get('status')
        password = data.get('password')

        # Check if email or username already exists
        if email in users:
            return jsonify(success=False, message="Email already exists.")
        if any(user['username'] == username for user in users.values()):
            return jsonify(success=False, message="Username already exists.")

        # Register new user
        user_id = len(users) + 1
        users[email] = {
            'user_id': user_id,
            'username': username,
            'email': email,
            'telephone': telephone,
            'country': country,
            'birthday': birthday,
            'status': status,
            'password': password
        }

        return jsonify(success=True, message="Registration successful!")

    return render_template('register.html')



@main.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.get_json() if request.is_json else request.form
        identifier = data.get('identifier')  # Can be username or email
        password = data.get('password')

        user = next(
            (user for user in users.values() if user['email'] == identifier or user['username'] == identifier),
            None
        )

        if user and user['password'] == password:
            # Set the user email as a cookie for session tracking
            resp = make_response(redirect('/profile'))
            resp.set_cookie('user_email', user['email'], httponly=True)
            return resp

        return jsonify(success=False, message="Invalid credentials.")

    return render_template('login.html')



@main.route('/profile')
def profile():
    email = request.cookies.get('user_email')
    user = users.get(email)

    if not user:
        resp = make_response(redirect(url_for('main.login')))
        resp.delete_cookie('user_email')
        return resp

    return render_template('profile.html', user={
        "user_id": user.get("user_id"),
        "username": user.get("username"),
        "email": user.get("email"),
        "telephone": user.get("telephone"),
        "country": user.get("country"),
        "birthday": user.get("birthday"),
        "status": user.get("status"),
        "password": user.get("password"),
    })

@main.route('/logout')
def logout():
    resp = make_response(redirect(url_for('main.login')))
    resp.delete_cookie('user_email')
    return resp

@main.route('/donor', methods=['GET', 'POST'])
def donor():
    if request.method == 'POST':
        # Process the form data
        data = request.form
        required_fields = ['name', 'blood_type', 'organ_donated', 'contact_info']
        if not all(field in data and data[field] for field in required_fields):
            return jsonify({"message": "All fields are required!"}), 400
        # Add donor data to in-memory list
        donor_data = {
            'name': data['name'],
            'blood_type': data['blood_type'],
            'organ_donated': data['organ_donated'],
            'contact_info': data['contact_info']
        }
        donors.append(donor_data)
        return jsonify({"message": "Donor data submitted successfully!"}), 200
    return render_template('donor.html')


@main.route('/register-donor', methods=['POST'])
def register_donor():
    data = request.get_json()

    if not data or 'name' not in data or 'bloodType' not in data or 'status' not in data or 'organDonated' not in data:
        return jsonify({"success": False, "message": "Invalid data"}), 400

    # Add donor to the donors list
    donor_data = {
        'name': data['name'],
        'blood_type': data['bloodType'],
        'status': data['status'],
        'organ_donated': data['organDonated']
    }
    donors.append(donor_data)
    return jsonify({"success": True, "message": "Donor registered successfully!"})


@main.route('/get-donors', methods=['GET'])
def get_donors():
    """Fetch all donors."""
    return jsonify({'success': True, 'donors': donors})


@main.route('/patient', methods=['GET', 'POST'])
def patient():
    if request.method == 'POST':
        # Process patient registration form data
        data = request.form
        required_fields = ['name', 'gender', 'birthday', 'email', 'phone', 'address', 'organ_needed']
        
        # Check if all required fields are present and not empty
        if not all(field in data and data[field] for field in required_fields):
            return jsonify({"message": "All fields are required!"}), 400

        # Add patient data to the in-memory list
        patient_data = {
            'name': data['name'],
            'gender': data['gender'],
            'birthday': data['birthday'],
            'email': data['email'],
            'phone': data['phone'],
            'address': data['address'],
            'organ_needed': data['organ_needed']
        }
        patients.append(patient_data)
        return jsonify({"message": "Patient data submitted successfully!"}), 200

    return render_template('patient.html')

@main.route('/records')
def records():
    # Render records page with donors and patients data
    return render_template('records.html', donors=donors, patients=patients)


# Register blueprint
app.register_blueprint(main)

# Main entry point
if __name__ == '__main__':
    app.run(debug=True)
