import { useRef, useState } from "react";

import { IconButton } from "@/components/IconButton";
import { Dialog } from "@/components/Dialog";

import UserSvg from "@/assets/user-plus.svg";

function AddContactsButton() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [contacts, setContacts] = useState([]);

  if (!navigator.contacts) {
    return null;
  }

  return (
    <>
      <IconButton
        title="Add contacts"
        onClick={() =>
          navigator.contacts
            .select(["name", "email"], { multiple: true })
            .then((selected: any) => {
              if (selected?.length) {
                setContacts(selected);
                dialog.current?.showModal();
              }
            })
        }
      >
        <UserSvg />
      </IconButton>

      <Dialog ref={dialog}>{JSON.stringify(contacts, null, 2)}</Dialog>
    </>
  );
}

export { AddContactsButton };
