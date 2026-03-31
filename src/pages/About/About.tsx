/**
 * About page shell — composes the hero, tech stack, and features sections.
 * No state; all content is static.
 */
import "./About.css";
import { AppLayout } from "../../components/AppLayout";
import { AboutHero } from "./AboutHero";
import { AboutStack } from "./AboutStack";
import { AboutFeatures } from "./AboutFeatures";

export default function About() {
  return (
    <AppLayout>
      <section className="about">
        <div className="about__container">
          <AboutHero />
          <AboutStack />
          <AboutFeatures />
        </div>
      </section>
    </AppLayout>
  );
}
