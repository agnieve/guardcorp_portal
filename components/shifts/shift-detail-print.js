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


const MyDocument = ({data}) => {

    const dateShift = new Date(data?.event?.start).toLocaleDateString();
    const start = new Date(data?.event?.start).toLocaleTimeString();
    const end = new Date(data?.event?.end).toLocaleTimeString();

    return (


        <Document>
            <Page size="A4" style={styles.page}>
                <Image style={{zIndex: '-20', position: 'absolute', top: 0, right: 0, width: '100%', height: 100}}
                       alt={'header image'} src={'https://guardcorp-portal.vercel.app/header.png'}/>
                <Text style={{
                    textAlign: 'right',
                    marginTop: 30,
                    marginRight: 30,
                    fontSize: 12
                }}>{data?.event?.site.siteName}</Text>
                <Text style={{textAlign: 'right', fontSize: 10, marginRight: 30}}>{dateShift}</Text>
                <Text style={{textAlign: 'right', fontSize: 10, marginRight: 30}}>{start} - {end}</Text>
                <View style={{marginTop: 70, marginHorizontal: 25}}>
                    <Text style={{textAlign: 'center'}}>Shift Report</Text>
                    <View style={styles.section}>
                        <Text style={{fontSize: 12}}>Team Members</Text>
                        <View style={{justifyContent: 'space-between', flexDirection: "row"}}>
                            <Text style={{fontSize: 10, width: '40%', padding: 2}}>Name</Text>
                            <Text style={{fontSize: 10, width: '40%', padding: 2}}>Email</Text>
                            <Text style={{fontSize: 10, width: '20%', padding: 2}}>License Number</Text>
                        </View>
                        <View style={{height: 1, width: '100%', backgroundColor: 'grey', marginBottom: 5}}></View>
                        <View style={{justifyContent: 'space-between', flexDirection: "row"}}>
                            <Text style={{fontSize: 10, width: '40%', padding: 2}}>{data?.event?.user.fullName}</Text>
                            <Text style={{fontSize: 10, width: '40%', padding: 2}}>{data?.event?.user.email}</Text>
                            <Text style={{
                                fontSize: 10,
                                width: '20%',
                                padding: 2
                            }}>{data?.event?.user.licenseNumber}</Text>
                        </View>
                    </View>
                    <View style={styles.section}>
                        <Text style={{fontSize: 12}}>Activity Log</Text>
                        <View style={{justifyContent: 'space-between', flexDirection: "row"}}>
                            <Text style={{fontSize: 10, width: '40%', padding: 2}}>Time</Text>
                            <Text style={{fontSize: 10, width: '40%', padding: 2}}>Type of Activity</Text>
                            <Text style={{fontSize: 10, width: '20%', padding: 2}}>Member</Text>
                        </View>
                        <View style={{height: 1, width: '100%', backgroundColor: 'grey', marginBottom: 5}}></View>
                        {
                            data?.inspections?.map((inspection, index) =>  <View key={index} style={{justifyContent: 'space-between', flexDirection: "row"}}>
                                <Text style={{fontSize: 10, width: '40%', padding: 2}}>{new Date(inspection.date).toLocaleTimeString()}</Text>
                                <Text style={{fontSize: 10, width: '40%', padding: 2}}>{inspection.type}</Text>
                                <Text style={{fontSize: 10, width: '20%', padding: 2}}>{data?.event?.user.fullName}</Text>
                            </View> )
                        }

                        {
                            data?.patrol?.map((inspection, index) =>
                                <View key={index} style={{justifyContent: 'space-between', flexDirection: "row"}}>
                                <Text style={{fontSize: 10, width: '40%', padding: 2}}>{new Date(inspection.dateTime).toLocaleTimeString()}</Text>
                                <Text style={{fontSize: 10, width: '40%', padding: 2}}>{inspection.type}</Text>
                                <Text style={{fontSize: 10, width: '20%', padding: 2}}>{data?.event?.user.fullName}</Text>
                            </View> )
                        }

                    </View>

                    <View style={styles.section}>
                        <Text style={{fontSize: 12}}>Events/Incidents</Text>
                        <View style={{justifyContent: 'space-between', flexDirection: "row"}}>
                            <Text style={{fontSize: 10, width: '20%', padding: 2}}>Time</Text>
                            <Text style={{fontSize: 10, width: '20%', padding: 2}}>Type of Incident</Text>
                            <Text style={{fontSize: 10, width: '30%', padding: 2}}>Team</Text>
                            <Text style={{fontSize: 10, width: '30%', padding: 2}}>Detail</Text>
                        </View>
                        <View style={{height: 1, width: '100%', backgroundColor: 'grey', marginBottom: 5}}></View>
                        {
                            data?.incidents?.map((incidents, index) =>  <View key={index} style={{justifyContent: 'space-between', flexDirection: "row"}}>
                                <Text style={{fontSize: 10, width: '40%', padding: 2}}>{new Date(incidents.date).toLocaleTimeString()}</Text>
                                <Text style={{fontSize: 10, width: '40%', padding: 2}}>{incidents.type}</Text>
                                <Text style={{fontSize: 10, width: '20%', padding: 2}}>{data?.event?.user.fullName}</Text>
                                <Text style={{fontSize: 10, width: '40%', padding: 2}}>{incidents.notes}</Text>
                            </View> )
                        }
                    </View>
                </View>
                <Image style={{
                    position: 'absolute', bottom: 0,
                    left: 0, width: '100%', height: 70
                }} src={'https://guardcorp-portal.vercel.app/footer.png'} alt={'pdf footer'}/>
            </Page>
        </Document>
    );
}

export async function downloadDocument(data) {

    console.log('from downloadDocument');
    console.log(data);
    const blob = await ReactPDF.pdf(<MyDocument
        data={data}

    />).toBlob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = data?.event?.start;
    a.click()
}
