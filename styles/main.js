import { StyleSheet } from "react-native"

export default StyleSheet.create({
    containerMain: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    bottomView: {
        width: '100%',
        height: 190,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
    },
    buttonBorder: {
        alignItems: "center",
        height: 50,
        width: "80%",
        justifyContent: "center",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#000',
        marginBottom: 15
    },
    button: {
        alignItems: "center",
        backgroundColor: "#F5A962",
        height: 50,
        width: "80%",
        justifyContent: "center",
        borderRadius: 5,
    },
    logo: {
        height: 300,
        width: 300,
    },
    input: {
        height: 48,
        marginBottom: 15,
        width: "80%",
        paddingStart: 15,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        backgroundColor: 'rgba(196, 196, 196, 0.4)',
        borderBottomWidth: 1.5,
    },
    forgotPasswordText: {
        fontSize: 10,
        textDecorationStyle: "solid",
        textDecorationLine: "underline"

    },
    editProfile: {
        marginTop: 20,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        height: 30,
        borderRadius: 5,
        borderWidth: 1.3,
        borderColor: "black"
    }
})
