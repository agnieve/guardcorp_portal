import ReactPDF, {Page, Text, View, Document, StyleSheet, Image} from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        backgroundColor: '#ffffff',
    },
    section: {
        margin: 5,
        padding: 10,
        lineHeight: 1.8
    },
});

const MyDocument = () => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Image style={{zIndex:'-20', position:'absolute', top:0, right:0, width: '100%', height:100}} alt={'header image'} src={'http://localhost:3000/header.png'} />
            <Text style={{textAlign: 'right', marginTop: 30, marginRight:30, fontSize: 12}}>Gaisano Mall (Client Name)</Text>
            <Text style={{textAlign: 'right', fontSize:10, marginRight:30}}>11/16/2022</Text>
            <Text style={{textAlign: 'right', fontSize:10, marginRight:30}}>7:30 - 15:30</Text>
            <View style={{marginTop: 70, marginHorizontal: 25}}>
                <Text style={{textAlign:'center'}}>Shift Report</Text>
                <View style={styles.section}>
                    <Text style={{fontSize:12}}>Team Members</Text>
                    <View style={{justifyContent:'space-between', flexDirection:"row"}}>
                        <Text style={{fontSize:10, width:'40%', padding: 2}}>Name</Text>
                        <Text style={{fontSize:10, width:'40%', padding: 2}}>Email</Text>
                        <Text style={{fontSize:10, width:'20%', padding: 2}}>License Number</Text>
                    </View>
                    <View style={{height:1, width:'100%', backgroundColor:'grey', marginBottom:5}}></View>
                    <View style={{justifyContent:'space-between', flexDirection:"row"}}>
                        <Text style={{fontSize:10, width:'40%', padding: 2}}>AG Nieve</Text>
                        <Text style={{fontSize:10, width:'40%', padding: 2}}>agnieve70@gmail.com</Text>
                        <Text style={{fontSize:10, width:'20%', padding: 2}}>1234</Text>
                    </View>
                    <View style={{justifyContent:'space-between', flexDirection:"row"}}>
                        <Text style={{fontSize:10, width:'40%', padding: 2}}>John Doe</Text>
                        <Text style={{fontSize:10, width:'40%', padding: 2}}>john@gmail.com</Text>
                        <Text style={{fontSize:10, width:'20%', padding: 2}}>1234232</Text>
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={{fontSize:12}}>Activity Log</Text>
                    <View style={{justifyContent:'space-between', flexDirection:"row"}}>
                        <Text style={{fontSize:10, width:'40%', padding: 2}}>Time</Text>
                        <Text style={{fontSize:10, width:'40%', padding: 2}}>Type of Activity</Text>
                        <Text style={{fontSize:10, width:'20%', padding: 2}}>Member</Text>
                    </View>
                    <View style={{height:1, width:'100%', backgroundColor:'grey', marginBottom:5}}></View>
                    <View style={{justifyContent:'space-between', flexDirection:"row"}}>
                        <Text style={{fontSize:10, width:'40%', padding: 2}}>7:30</Text>
                        <Text style={{fontSize:10, width:'40%', padding: 2}}>Checked Camera</Text>
                        <Text style={{fontSize:10, width:'20%', padding: 2}}>AG</Text>
                    </View>
                    <View style={{justifyContent:'space-between', flexDirection:"row"}}>
                        <Text style={{fontSize:10, width:'40%', padding: 2}}>7:32</Text>
                        <Text style={{fontSize:10, width:'40%', padding: 2}}>Checked Camera</Text>
                        <Text style={{fontSize:10, width:'20%', padding: 2}}>John Doe</Text>
                    </View>
                    <View style={{justifyContent:'space-between', flexDirection:"row"}}>
                        <Text style={{fontSize:10, width:'40%', padding: 2}}>8:34</Text>
                        <Text style={{fontSize:10, width:'40%', padding: 2}}>Start Patrol</Text>
                        <Text style={{fontSize:10, width:'20%', padding: 2}}>AG</Text>
                    </View>
                    <View style={{justifyContent:'space-between', flexDirection:"row"}}>
                        <Text style={{fontSize:10, width:'40%', padding: 2}}>8:34</Text>
                        <Text style={{fontSize:10, width:'40%', padding: 2}}>Start Patrol</Text>
                        <Text style={{fontSize:10, width:'20%', padding: 2}}>John Doe</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={{fontSize:12}}>Events/Incidents</Text>
                    <View style={{justifyContent:'space-between', flexDirection:"row"}}>
                        <Text style={{fontSize:10, width:'20%', padding: 2}}>Time</Text>
                        <Text style={{fontSize:10, width:'20%', padding: 2}}>Type of Incident</Text>
                        <Text style={{fontSize:10, width:'30%', padding: 2}}>Team</Text>
                        <Text style={{fontSize:10, width:'30%', padding: 2}}>Detail</Text>
                    </View>
                    <View style={{height:1, width:'100%', backgroundColor:'grey', marginBottom:5}}></View>
                    <Text style={{fontSize:10, width:'20%', padding: 2}}>No Event/Incident</Text>
                </View>
            </View>
            <Image style={{position:'absolute', bottom: 0,
                left: 0, width:'100%', height:70}} src={'http://localhost:3000/footer.png'} alt={'pdf footer'} />
        </Page>
    </Document>
);

export async function downloadDocument() {
    const blob = await ReactPDF.pdf(<MyDocument

    />).toBlob();
    const url = URL.createObjectURL(blob);

    return url;
}
