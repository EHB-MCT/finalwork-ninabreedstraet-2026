import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import style from "./account.module.scss";
import { BracketItem } from "../../components/bracketItem/bracketItem";

export default function Account() {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [updateMsg, setUpdateMsg] = useState("");

  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setProjects(data ?? []));
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading]);

  useEffect(() => {
    if (user) {
      setFirstName(user.user_metadata?.first_name || "");
      setLastName(user.user_metadata?.last_name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleUpdateProfile = async () => {
    setUpdateMsg("");
    const { error } = await supabase.auth.updateUser({
      data: { first_name: firstName, last_name: lastName },
      email: email || undefined,
    });

    if (error) {
      setUpdateMsg(t("account.error", { message: error.message }));
    } else {
      setUpdateMsg(t("account.profileUpdated"));
    }
  };

  const handleUpdatePassword = async () => {
    setUpdateMsg("");
    if (!password) return;
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setUpdateMsg(t("account.error", { message: error.message }));
    } else {
      setUpdateMsg(t("account.passwordUpdated"));
      setPassword("");
    }
  };

  if (loading) return <div>{t("account.loading")}</div>;

  return (
    <div className={style.alles}>
      <button onClick={handleLogout} className={style.tab}>
        <BracketItem>{t("account.logout")}</BracketItem>
      </button>
      <div className={style.account}>
        <div className={style.settings}>
          <div className={style.accountForm}>
            <h2>{t("account.accountData")}</h2>

            <div className={style.formGroup}>
              <label>{t("account.firstName")}</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className={style.formGroup}>
              <label>{t("account.lastName")}</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div className={style.formGroup}>
              <label>{t("account.email")}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button onClick={handleUpdateProfile} className={style.tab}>
              <BracketItem>{t("account.updateProfile")}</BracketItem>
            </button>

            <div className={style.formGroup}>
              <label>{t("account.newPassword")}</label>
              <input
                type="password"
                placeholder={t("account.newPassword")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button onClick={handleUpdatePassword} className={style.tab}>
              <BracketItem>{t("account.changePassword")}</BracketItem>
            </button>

            {updateMsg && <p className={style.updateMsg}>{updateMsg}</p>}
          </div>
        </div>
        <div className={style.projects}>
          <h2>{t("account.projects")}</h2>
          <div className={style.projectList}>
            {projects.length === 0 ? (
              <p>{t("account.noProjects")}</p>
            ) : (
              projects.map((project) => (
                <div key={project.id} className={style.projectCard}>
                  <p>{project.name}</p>
                  <button
                    onClick={() =>
                      navigate(
                        `/maken?sketch=${project.sketch_id}&project=${project.id}`,
                      )
                    }
                    className={style.tabProject}
                  >
                    <BracketItem>{t("account.open")}</BracketItem>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
