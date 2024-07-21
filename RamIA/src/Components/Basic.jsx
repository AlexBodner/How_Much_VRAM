import Preset from "./Preset"
import Form from "./Form"
import '../styles/Basic.css'

export default function Basic() {
    return (
        <section className="basicContainer">
            <Preset/>
            <Form/>
        </section>
    )
}